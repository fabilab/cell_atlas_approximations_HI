import React, { useState, useEffect, useCallback } from "react";
import atlasapprox from "@fabilab/atlasapprox";
import ImageMapper from "react-img-mapper";
import orgMeta from "../../utils/organismMetadata.js";
import { fetchWikiImage } from "../../utils/cellTypeResources/fetchImage.js";
import BubbleHeatmap from "./BubbleHeatmap";
import { scaleImage } from "../../utils/plotHelpers/scaleImage.js";
import { fetchCellTypeDescription } from "../../utils/cellTypeResources/fetchDescription.js";
import { BarChartOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Typography, Select, Table, Spin } from "antd";
import { scaleLinear } from "d3-scale";
import Plot from "react-plotly.js";

const { Option } = Select;
const { Text } = Typography;

/**
 * CellTypeProfile Component
 *
 * This component provides an interactive visualization of cell type distribution
 * across organism and organs. It displays:
 * - An image and description of the selected cell type.
 * - A bar chart of cell type distribution across organism and organs.
 * - An organ map when a organism is selected.
 * - A table of top 10 marker genes and a bubble heatmap when an organ is selected.
 * - Log transformation support for gene expression dot plots.
 */

const CellTypeProfile = ({ state }) => {
  const { cellType, distributionData, hasLog } = state;

  const [description, setDescription] = useState(null);
  const [selectedOrganism, setSelectedOrganism] = useState("all");
  const [clickedOrgan, setClickedOrgan] = useState(null);
  const [wikiImage, setWikiImage] = useState(null);
  const [selectedOrganMarkers, setSelectedOrganMarkers] = useState(null);
  const [loadingMarkerPlot, setLoadingMarkerPlot] = useState(true);
  const [loadingMarker, setLoadingMarker] = useState(true);
  const [markerExpressionPlotData, setMarkerExpressionPlotData] = useState(null);
  const [distributionPlotData, setDistributionPlotData] = useState(null);
  const [distributionPlotLayout, setDistributionPlotLayout] = useState(null);
  const [scalingFactors, setScalingFactors] = useState({ width: 1, height: 1 });

  const imageUnavailableNotice = require("../../asset/imageUnavailable.png");
  /**
   * Fetches the cell type image from Wikipedia when the cellType changes.
   */
  useEffect(() => {
    setSelectedOrganism("all");
    setClickedOrgan(null);
    setSelectedOrganMarkers(null);

    const getImage = async () => {
      const imageData = await fetchWikiImage(cellType);
      setWikiImage(imageData);
    };
    getImage();

    const getDescription = async () => {
      let cellTypeDescription = await fetchCellTypeDescription(cellType);
      setDescription(cellTypeDescription);
    };
    getDescription();
  }, [cellType]);

  /**
   * Generates a bar chart of cell type distribution across species and organs.
   */
  const makePlot = useCallback(() => {
    let d =
      selectedOrganism !== "all"
        ? distributionData.data.filter((d) => d.organism === selectedOrganism)
        : distributionData.data;
    // Group percentages by organ
    let organData = {};
    d.forEach(({ organ, organism, percentage }) => {
      if (!organData[organ]) {
        organData[organ] = {};
      }
      organData[organ][organism] = percentage;
    });
  
    const sortedOrgans = Object.keys(organData).sort(
      (a, b) => Math.max(...Object.values(organData[b])) - Math.max(...Object.values(organData[a]))
    );
  
    // Ensure all bars have the same width
    const barWidth = sortedOrgans.length > 2 ? 0.8 : 0.4;
  
    // Adjust chart width dynamically
    const chartWidth = sortedOrgans.length >= 24 ? 35 * sortedOrgans.length + 200 : 30 * sortedOrgans.length + 500;
  
    // Generate bar chart data
    const plotData = [];
    const organismSet = new Set(d.map((item) => item.organism));
  
    organismSet.forEach((organism) => {
      const yValues = sortedOrgans.map((organ) => (organData[organ][organism] || 0));
  
      plotData.push({
        x: sortedOrgans,
        y: yValues,
        name: organism,
        type: "bar",
        text: yValues.map((p) => p.toFixed(2)),
        textposition: "auto",
        width: Array(sortedOrgans.length).fill(barWidth),
        showlegend: true,
      });
    });
  
    // Calculate the sum of each stack to find the tallest one
    const stackSums = sortedOrgans.map((organ) => {
      let sum = 0;
      plotData.forEach((trace) => {
        const organIndex = trace.x.indexOf(organ);
        if (organIndex !== -1) {
          sum += trace.y[organIndex];
        }
      });
      return sum;
    });
  
    const maxStackSum = Math.max(...stackSums);
    const maxY = maxStackSum * 1.1; // Set y-axis max to 1.1 times the tallest stack
  
    // Define layout with adjusted y-axis range
    const plotLayout = {
      width: chartWidth,
      height: 460,
      barmode: "stack",
      margin: {
        r: 50,
        t: 50,
        b: 100,
        l: 80,
      },
      xaxis: {
        title: {
          text: "Organs",
          standoff: 20,
        },
        tickangle: 45,
        automargin: true,
      },
      yaxis: {
        title: {
          text: "Proportion (%)",
          standoff: 20,
        },
        range: [0, maxY],
      },
      plot_bgcolor: "white",
      paper_bgcolor: "white",
      font: {
        family: "Arial, sans-serif",
        size: 12,
      },
      legend: {
        showlegend: true,
        x: 1, // Right edge of the chart
        y: 1.1, // Top of the chart
        xanchor: "right",
        yanchor: "top",
        orientation: "v", // Vertical orientation
        traceorder: "normal",
        bgcolor: "rgba(255, 255, 255, 0.8)",
        bordercolor: "#E2E2E2",
        borderwidth: 1,
      },
    };
  
    setDistributionPlotData(plotData);
    setDistributionPlotLayout(plotLayout);
  }, [selectedOrganism, distributionData.data]);

  const fetchMarkers = useCallback(
    async (organ) => {
      try {
        const marker_params = {
          organism: selectedOrganism,
          organ: organ,
          celltype: cellType,
          number: 10,
          measurement_types: "gene_expression",
        };

        let apiResponse = await atlasapprox.markers(marker_params);
        let markers = apiResponse.markers;

        apiResponse = await atlasapprox.dotplot({
          organism: selectedOrganism,
          organ: organ,
          features: markers,
          measurement_types: "gene_expression",
        });

        const cellTypeIndex = apiResponse.celltypes.indexOf(cellType);
        const expressionLevel = apiResponse.average.map((a) => a[cellTypeIndex].toFixed(2));
        const fractionDetected = apiResponse.fraction_detected.map((f) => (f[cellTypeIndex] * 100).toFixed(2) + "%");
        const combined = markers.map((gene, index) => ({
          gene,
          expression: expressionLevel[index],
          fraction: fractionDetected[index],
        }));

        return { dotPlotData: apiResponse, markerExpression: combined };
      } catch (error) {
        console.error("Error fetching markers:", error);
      }
    },
    [cellType, selectedOrganism]
  );

  const handleOrganSelect = async (area) => {
    if (area.name.includes("-label")) return;

    const organ = area.name;
    let d = distributionData.data.filter((d) => d.organism === selectedOrganism).map(d=>d.organ)
    
    if (!d.includes(organ)) return;

    setClickedOrgan(area.name);
    setLoadingMarker(true);
    setLoadingMarkerPlot(true);

    const { dotPlotData, markerExpression } = await fetchMarkers(area.name);

    setMarkerExpressionPlotData(dotPlotData);
    setLoadingMarker(false);
    setLoadingMarkerPlot(false);
    setSelectedOrganMarkers(markerExpression);
  };

  const renderImageMap = () => {

    // Extract the relevant species' organ percentage data
    const match = distributionData.data.filter((d) => d.organism === selectedOrganism);
  
    if (match.length === 0) {
      return <></>;
    }
  
    // Convert the organ percentage data into a map
    const organPercentages = match.reduce((acc, item) => {
      acc[item.organ] = item.percentage; // Use percentage instead of count
      return acc;
    }, {});

    // If only one organ, show the species's picture from './organism'
    if (Object.keys(organPercentages).length === 1) {
      return (
        <ImageMapper
          id="organism-image"
          src={require(`../../asset/organisms/${selectedOrganism}.jpeg`)}
          width={300}
          height={300}
        />
      );
    }
  
    // Define color scale
    const minPercentage = Math.min(...Object.values(organPercentages));
    const maxPercentage = Math.max(...Object.values(organPercentages));
    const colorScale = scaleLinear()
      .domain([minPercentage, maxPercentage])
      .range(["#f0d2cc", "#ed4e2b"]); // Light to dark color gradient
  
    // Generate organ map areas
    const areas = Object.entries(orgMeta[selectedOrganism].organs).map(([organ, metadata]) => {
      const coords = metadata.coords.split(",").map(Number);
      const adjustedCoords = coords.map((coord, index) =>
        index % 2 === 0 ? coord * scalingFactors.width : coord * scalingFactors.height
      );
  
      const organColor = organPercentages[organ] ? colorScale(organPercentages[organ]) : "transparent";
  
      return {
        id: organ,
        name: organ,
        shape: metadata.shape || "poly",
        coords: adjustedCoords,
        fillColor: distributionData.data.filter((d) => d.organism === selectedOrganism).map(d=>d.organ).includes(organ) ? "yellow" : organColor,
        preFillColor: clickedOrgan === organ ? 'yellow' : organColor,
        strokeColor: "transparent",
      };
    });
  
    let imagePathPrefix = `grey_${selectedOrganism}`;
  
    return (
      <ImageMapper
        id="organism-image"
        src={require(`../../asset/anatomy/${imagePathPrefix}.jpg`)}
        map={{ name: `${selectedOrganism}-map`, areas }}
        onClick={handleOrganSelect}
        width={450}
        height={450}
      />
    );
  };  

  const renderColorBar = () => {
    const match = distributionData.data.filter((d) => d.organism === selectedOrganism);

    if (!match.length || !match[0] || !Array.isArray(match[0].organCounts)) {
      return <></>;
    }
    const counts = match[0].organCounts.reduce((acc, item) => {
      acc[item.organ] = item.count;
      return acc;
    }, {});
    if (Object.keys(counts).length === 1) {
      return <></>;
    }
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginLeft: "10px" }}>
        <Text>High</Text>
        <div
          style={{
            height: "100px",
            width: "20px",
            background: `linear-gradient(to bottom, #ed4e2b, #f0d2cc)`,
            margin: "10px 0",
          }}
        />
        <Text>Low</Text>
      </div>
    );
  };

  useEffect(() => {
    if (!distributionPlotData) {
      makePlot();
    }
  });

  useEffect(() => {
    setClickedOrgan(null);
    setSelectedOrganMarkers(null);
    if (selectedOrganism === "all") {
      makePlot();
    } else {
      makePlot();
      if (orgMeta[selectedOrganism].organs) {
        const imagePathPrefix = `grey_${selectedOrganism}`;
        let imageWithDimensions = require(`../../asset/anatomy/${imagePathPrefix}.jpg`);
        scaleImage(imageWithDimensions, 450, setScalingFactors);
      }

      const fetch_data = async (organ) => {
        setClickedOrgan(organ);
        setLoadingMarker(true);
        setLoadingMarkerPlot(true);

        const { dotPlotData, markerExpression } = await fetchMarkers(organ);

        setMarkerExpressionPlotData(dotPlotData);
        setSelectedOrganMarkers(markerExpression);
        setLoadingMarker(false);
        setLoadingMarkerPlot(false);
      };

      const match = distributionData.data.filter((d) => d.organism === selectedOrganism);
      if (match.length === 1) {
        const organ = match[0].organ;
        fetch_data(organ);
      }
      if (match.length >= 1) {
          // Find the organ with the highest percentage
        const highestOrgan = match.reduce((max, item) =>
          !max || item.percentage > max.percentage ? item : max
        , null)?.organ;
        if (highestOrgan) {
          fetch_data(highestOrgan);
        }
      }
    }
  }, [selectedOrganism, makePlot, distributionData, fetchMarkers]);

  return (
    <div style={{ padding: "20px" }}>
      {/* cell type name, picture and desctiption */}
      <h1 style={{ fontSize: "24px", marginBottom: "15px", fontWeight: "bold", color: "#1890ff", cursor: "pointer"}}>
      <a 
        href={`https://www.google.com/search?q=${encodeURIComponent(cellType)}`} target="_blank" rel="noopener noreferrer"
        style={{ textDecoration: "none", color: "#116bf2"}}
      >
        {cellType}
      </a>
        </h1>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "20px", marginBottom: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
          <img
            src={wikiImage ? wikiImage.url : imageUnavailableNotice}
            alt={`${cellType} cell`}
            style={{ width: "120px", height: "120px", objectFit: "cover" }}
          />
        </div>
        <p style={{ fontSize: "16px", lineHeight: "1.5", flex: 1 }}>
          {description || "loading"}{" "}
          <span style={{ fontSize: "15px", color: "#888" }}>
            (Source:{" "}
            <a href="https://www.ebi.ac.uk/ols4" target="_blank" rel="noopener noreferrer" style={{ color: "#116bf2" }}>
              EBI
            </a>
            )
          </span>
        </p>
      </div>

      {/* cell type distribution bar chart */}
      <h1 style={{ fontSize: "1.3em", fontWeight: "600", color: "#333", display: "flex", alignItems: "center", gap: "8px" }}>
        Cell type distribution in
        <Select defaultValue="all" style={{ width: 150 }} onChange={(value) => setSelectedOrganism(value)} value={selectedOrganism}>
          <Option value="all">All</Option>
            {Array.from(new Set(distributionData.data.map((d) => d.organism))).map((organism) => (
              <Option key={organism} value={organism}>{organism}</Option>
            ))}
        </Select>
      </h1>
      <div style={{ marginTop: "16px", fontSize: "15px", color: "#555", display: "flex", alignItems: "center" }}>
      <p style={{ fontSize: "14px", marginTop: "10px" }}>
        <BarChartOutlined style={{ fontSize: "20px", marginRight: "5px", color: "#007bff" }} />
        The percentages in the chart represent the proportion of <b>{cellType}</b> cells relative to all measured cells in a specific organ of a species. Each color in the chart represents a different species. Select a species from the dropdown to view the organ map and marker gene data.
      </p>
      </div>
      {distributionPlotData && distributionPlotLayout && (
        <div style={{ width: "100%", display: "flex" }}>
          <Plot data={distributionPlotData} layout={distributionPlotLayout} config={{ responsive: true, displayModeBar: false }} style={{ width: "900px", height: "450px" }} />
        </div>
      )}

      {/* organ map */}
      {selectedOrganism !== "all" && Object.keys(orgMeta[selectedOrganism]?.organs || {}).length >= 1 && (
        <>
          <h1 style={{ fontSize: "22px", marginBottom: "8px", fontWeight: "bold" }}>Organ map</h1>
          <div style={{ marginTop: "16px", fontSize: "15px", color: "#888", display: "flex", alignItems: "center" }}>
            <InfoCircleOutlined style={{ marginRight: "8px" }} />
            <p>Click an organ to view the top 10 marker genes for the cell type.</p>
          </div>
        </>
      )}
      <div style={{ padding: "0% 5%", display: "flex", justifyContent: "space-between" }}>
        {/* species's picture with/without label */}
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {selectedOrganism !== "all" && renderImageMap()}
          </div>
          {selectedOrganism !== "all" && renderColorBar()}
        </div>
        {/* markers table */}
        <div style={{ flex: 1, overflow: "auto", minWidth: "0", paddingLeft: "5%" }}>
          {clickedOrgan && selectedOrganism ? (
            !loadingMarker ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h4>
                  Top 10 markers for {cellType} in {selectedOrganism}{" "}
                  <span style={{ color: "red", fontWeight: "bold" }}>{clickedOrgan}</span>
                </h4>
                <Table
                  className="compact-table"
                  dataSource={selectedOrganMarkers.map((marker, index) => ({
                    key: index,
                    gene: marker.gene,
                    expression: marker.expression,
                    fraction: marker.fraction,
                  }))}
                  columns={[
                    { title: "Gene", dataIndex: "gene", key: "gene", render: (text) => 
                        selectedOrganism === "h_sapiens" && markerExpressionPlotData.measurement_type === "gene_expression" ? (
                          <a href={`https://www.genecards.org/cgi-bin/carddisp.pl?gene=${text}`} target="_blank" rel="noopener noreferrer">{text}</a>
                        ) : text },
                    { title: "Expression (cptt)", dataIndex: "expression", key: "expression", align: "center" },
                    { title: "Cell fraction expressing", dataIndex: "fraction", key: "fraction", align: "center" },
                  ]}
                  pagination={false}
                  bordered
                  size="small"
                />
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <Spin size="large" />
                <p>Loading markers...</p>
              </div>
            )
          ) : null}
        </div>
      </div>

      <div style={{ padding: "24px", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {clickedOrgan && selectedOrganism ? (
          !loadingMarkerPlot ? (
            <div style={{ width: "100%", overflowX: "auto", overflowY: "visible", paddingBottom: "20px" }}>
              <div style={{ minWidth: "max-content", display: "inline-block", height: "auto", minHeight: "600px" }}>
                <BubbleHeatmap
                  state={{
                    plotType: "fractionDetected",
                    xaxis: markerExpressionPlotData.celltypes,
                    yaxis: markerExpressionPlotData.features,
                    average: markerExpressionPlotData.average,
                    fractions: markerExpressionPlotData.fraction_detected,
                    organism: selectedOrganism,
                    organ: markerExpressionPlotData.organ,
                    celltype: false,
                    unit: markerExpressionPlotData.unit,
                    hasLog: hasLog,
                    measurement_type: markerExpressionPlotData.measurement_type,
                    queriedGenes: false,
                    isSurface: false,
                  }}
                />
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <Spin size="large" />
              <p>Loading plot</p>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
};
export default CellTypeProfile;
