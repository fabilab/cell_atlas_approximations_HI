import React, { useState, useRef, useEffect } from "react";
import ImageMapper from "react-img-mapper";
import HighestMeasurementBar from "./HighestMeasurementBar"; // Import the new component
import orgMeta from "../../utils/organismMetadata.js";
import { scaleLinear } from "d3-scale";
import { Typography } from "antd";
import BarChart from "./BarChart.js";
const { Text } = Typography;

const HighestMeasurement = ({ state }) => {
  const { feature, organism, celltypesOrgan, organs, celltypes, average, topNExp, unit } = state;
  const imageRef = useRef(null);
  const [scalingFactors, setScalingFactors] = useState({ width: 1, height: 1 });
  const [hoveredOrgan, setHoveredOrgan] = useState(null);
  const [organData, setOrganData] = useState([]); // New state to manage organ data

  // Get the max expression value for each organ
  const highestExprPerOrgan = {};
  organs.forEach((organ, index) => {
    if (!highestExprPerOrgan[organ]) {
      // Since the returned avg is already in descending order, just get the first exp (highest) for each organ
      highestExprPerOrgan[organ] = average[index];
    }
  });

  // Set up color scale
  const minExpression = Math.min(...Object.values(highestExprPerOrgan));
  const maxExpression = Math.max(...Object.values(highestExprPerOrgan));
  const colorScale = scaleLinear()
    .domain([minExpression, maxExpression])
    .range(["#edc2bb", "#eb3417"]);

  // Adjust scaling factors based on image size
  useEffect(() => {
    const intrinsicDimensions = orgMeta[organism]?.intrinsicDimensions;
    const updateScalingFactors = () => {
      const renderedWidth = imageRef.current?.clientWidth || 480;
      const renderedHeight = imageRef.current?.clientHeight || 480;

      setScalingFactors({
        width: renderedWidth / intrinsicDimensions.width,
        height: renderedHeight / intrinsicDimensions.height,
      });
    };

    // Call the function initially and add an event listener for window resizing
    updateScalingFactors();
    window.addEventListener("resize", updateScalingFactors);

    return () => {
      window.removeEventListener("resize", updateScalingFactors);
    };
  }, [organism]);

  const areas = Object.keys(orgMeta[organism]?.organs || {}).map((organ) => {
    const coords = orgMeta[organism].organs[organ].coords
      .split(",")
      .map(Number);
    const adjustedCoords = coords.map((coord, index) =>
      index % 2 === 0
        ? coord * scalingFactors.width
        : coord * scalingFactors.height
    );

    // Identify if the current area is a label
    const isLabel = organ.includes("-label");

    // Determine color based on the filtered expression values
    const organColor = highestExprPerOrgan[organ]
      ? colorScale(highestExprPerOrgan[organ])
      : "transparent";

    return {
      id: organ,
      name: organ,
      shape: orgMeta[organism].organs[organ].shape || "poly",
      coords: adjustedCoords,
      fillColor: isLabel ? "transparent" : organColor,
      preFillColor: isLabel ? "transparent" : organColor,
      strokeColor: "transparent",
    };
  });

  const renderImageMap = () => {
    return (
      <ImageMapper
        ref={imageRef}
        src={require(`../../asset/anatomy/grey_${organism}.jpg`)}
        map={{ name: `${organism}-map`, areas: areas }}
        onMouseEnter={(area) => handleMouseEnter(area)}
        width={480}
        height={480}
      />
    );
  };

  const handleMouseEnter = (area) => {
    if (area.name.includes("-label")) return null;
    setHoveredOrgan(area.name);

    // Reset organData before updating
    setOrganData([]);

    // Prepare data for the bar chart based on the hovered organ
    const newOrganData = organs
      .map((organ, index) => {
        if (organ === area.name) {
          return { cellType: celltypes[index], avgExpression: average[index] };
        }
        return null;
      })
      .filter((item) => item !== null);

    // Update the organ data when a new organ is hovered over
    setOrganData(newOrganData);
  };

  // Overwrite state.average with topNExp for the top barchart
  const updatedState = {
    ...state,
    average: topNExp, // Use topNExp as the average data
  };

  return (
    <div style={{ width: "inherit", alignItems: "center" }}>
      <div style={{padding: "1% 3%" }}>
          <BarChart
            state={updatedState}
          />
      </div>
        <div
        style={{
            padding: "0% 1%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
        }}
        >
        <div
            style={{
            flex: 1,
            overflow: "auto",
            minWidth: "0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            }}
        >
            {renderImageMap()}
            <Text style={{ alignSelf: "center" }}>
            * Hover over an organ for cell type information.
            </Text>
        </div>
        <div style={{ flex: 1, overflow: "auto", minWidth: "0" }}>
            {hoveredOrgan && (
            <HighestMeasurementBar
                organData={organData}
                hoveredOrgan={hoveredOrgan}
                feature={feature}
                organism={organism}
            />
            )}
        </div>
        </div>
    </div>
  );
};

export default HighestMeasurement;
