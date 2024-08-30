import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";

// This component renders a bar chart that displays the expression of
// a gene of interest across different cell types within a hovered organ.
// It is used within the "highest measurement intent"

const HighestMeasurementBar = ({
  organData,
  hoveredOrgan,
  feature,
  organism,
  unit,
}) => {
  const [cellTypes, setCellTypes] = useState([]);
  const [avgExpressions, setAvgExpressions] = useState([]);

  useEffect(() => {
    if (hoveredOrgan && organData.length) {
      setCellTypes(organData.map((item) => item.cellType));
      setAvgExpressions(organData.map((item) => item.avgExpression));
    } else {
      setCellTypes([]);
      setAvgExpressions([]);
    }
  }, [organData, hoveredOrgan]);

  if (!hoveredOrgan || !organData.length) return null;

  return (
    <Plot
      key={hoveredOrgan}
      data={[
        {
          type: "bar",
          x: avgExpressions,
          y: cellTypes,
          orientation: "h",
          marker: {
            color: "#e35f42",
          },
        },
      ]}
      layout={{
        title: {
          font: {
            size: 15,
          },
          text: `average expression of <i>${feature}</i> in ${hoveredOrgan}`,
        },
        width: 450,
        height: 250 + 20 * cellTypes.length,
        yaxis: {
          automargin: true,
          categoryorder: "total ascending",
        },
        xaxis: {
          autorange: true,
          title: `${unit}`,
        },
        bargap: 0.1,
      }}
    />
  );
};

export default HighestMeasurementBar;
