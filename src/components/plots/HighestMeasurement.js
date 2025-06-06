import React, { useState, useEffect, useMemo } from "react";
import ImageMapper from "react-img-mapper";
import HighestMeasurementBar from "./HighestMeasurementBar";
import orgMeta from "../../utils/organismMetadata.js";
import { scaleLinear } from "d3-scale";
import { Typography } from "antd";
import BarChart from "./BarChart.js";
import { scaleImage } from "../../utils/plotHelpers/scaleImage.js";
import { transformData } from "../../utils/plotHelpers/math.js";

const { Text } = Typography;

const HighestMeasurement = ({ state }) => {
  const { feature, measurement_type, organism, organs, celltypes, average, topNExp, topNOrgans, unit, hasLog } = state;
  const [scalingFactors, setScalingFactors] = useState({ width: 1, height: 1 });
  const [hoveredOrgan, setHoveredOrgan] = useState(null);
  const [organData, setOrganData] = useState([]);

  const uniqueOrgans = [...new Set(organs)];
  const hasMultipleOrgans = uniqueOrgans.length > 1;

  // Transform the average data for the bar chart
  const transformedAverage = useMemo(() => transformData(average, hasLog), [average, hasLog]);
  const transformedTopNExp = useMemo(() => transformData(topNExp, hasLog), [topNExp, hasLog]);

  // Get the max expression value for each organ
  const highestExprPerOrgan = {};
  organs.forEach((organ, index) => {
    if (!highestExprPerOrgan[organ]) {
      highestExprPerOrgan[organ] = transformedAverage[index];
    }
  });

  // Set up color scale for organ heatmap
  const minExpression = Math.min(...Object.values(highestExprPerOrgan));
  const maxExpression = Math.max(...Object.values(highestExprPerOrgan));
  const colorScale = scaleLinear()
    .domain([minExpression, maxExpression])
    .range(["#fae0de", "#ed4e2b"]);

  // Recompute organData whenever transformedAverage or hoveredOrgan changes
  useEffect(() => {
    if (!hoveredOrgan) {
      setOrganData([]);
      return;
    }

    const newOrganData = organs
      .map((organ, index) =>
        organ === hoveredOrgan
          ? { cellType: celltypes[index], avgExpression: transformedAverage[index] }
          : null
      )
      .filter(Boolean);
    
    setOrganData(newOrganData);
  }, [hoveredOrgan, transformedAverage, organs, celltypes]);

  // Set the default highlighted organ to the top organ by expression
  useEffect(() => {
    if (hasMultipleOrgans && topNOrgans?.length > 0 && !hoveredOrgan) {
      setHoveredOrgan(topNOrgans[0]); // Default to the organ with highest expression (e.g., "marrow")
    }
  }, [topNOrgans, hasMultipleOrgans, hoveredOrgan],);

  // Update scaling factors based on image size
  useEffect(() => {
    if (!hasMultipleOrgans) return;

    let imagePathPrefix;
    if (measurement_type === "chromatin_accessibility") {
      imagePathPrefix = `grey_${organism}_chromatin`;
    } else {
      imagePathPrefix = `grey_${organism}`;
    }
    let imageWithDimensions = require(`../../asset/anatomy/${imagePathPrefix}.jpg`);

    scaleImage(imageWithDimensions, 450, setScalingFactors);
    window.addEventListener("resize", scaleImage(imageWithDimensions, 450, setScalingFactors));

    return () => window.removeEventListener("resize", scaleImage(imageWithDimensions, 450, setScalingFactors));
  }, [organism, hasMultipleOrgans, measurement_type]);

  // Generate image map areas
  const areas = Object.entries(orgMeta[organism]?.organs || {}).map(([organ, metadata]) => {
    const coords = metadata.coords.split(",").map(Number);
    const adjustedCoords = coords.map((coord, index) =>
      index % 2 === 0 ? coord * scalingFactors.width : coord * scalingFactors.height
    );

    const isLabel = organ.includes("-label");
    const organColor = highestExprPerOrgan[organ] ? colorScale(highestExprPerOrgan[organ]) : "transparent";

    return {
      id: organ,
      name: organ,
      shape: metadata.shape || "poly",
      coords: adjustedCoords,
      fillColor: isLabel ? "transparent" : organColor,
      preFillColor: isLabel ? "transparent" : organColor,
      strokeColor: "transparent",
    };
  });

  // Handle mouse enter event for organ areas
  const handleMouseEnter = (area) => {
    if (area.name.includes("-label")) return;

    setHoveredOrgan(area.name);
    const newOrganData = organs
      .map((organ, index) =>
        organ === area.name
          ? { cellType: celltypes[index], avgExpression: transformedAverage[index] }
          : null
      )
      .filter(Boolean);

    setOrganData(newOrganData);
  };

  // Render image map component
  const renderImageMap = () => {
    let imagePathPrefix;
    if (measurement_type === "chromatin_accessibility") {
      imagePathPrefix = `grey_${organism}_chromatin`;
    } else {
      imagePathPrefix = `grey_${organism}`;
    }

    return (
      // eslint-disable-next-line
      <ImageMapper
        src={require(`../../asset/anatomy/${imagePathPrefix}.jpg`)}
        map={{ name: `${organism}-map`, areas: areas }}
        onMouseEnter={handleMouseEnter}
        width={450}
        height={450}
      />
    );
  };

  // Render color bar legend
  const renderColorBar = () => (
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

  return (
    <div style={{ width: "inherit", alignItems: "center" }}>
      <div style={{ padding: "1% 10%" }}>
        <BarChart state={{ ...state, average: transformedTopNExp }} />
      </div>
      {hasMultipleOrgans && (
        <div style={{ padding: "0% 4%", display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              {renderImageMap()}
              <Text style={{ alignSelf: "center", marginTop: "10px" }}>
                * Hover over organs to explore gene expression details
              </Text>
            </div>
            {renderColorBar()}
          </div>
          <div style={{ flex: 1, overflow: "auto", minWidth: "0", paddingLeft: "5%" }}>
            {hoveredOrgan && (
              <HighestMeasurementBar
                organData={organData}
                hoveredOrgan={hoveredOrgan}
                feature={feature}
                organism={organism}
                unit={unit}
                hasLog={hasLog}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HighestMeasurement;