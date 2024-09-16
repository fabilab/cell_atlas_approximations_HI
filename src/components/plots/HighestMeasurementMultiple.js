import React, { useState, useEffect } from "react";
import ImageMapper from "react-img-mapper";
import HighestMeasurementScoreBar from "./HighestMeasurementScoreBar";
import orgMeta from "../../utils/organismMetadata.js";
import { scaleLinear } from "d3-scale";
import { Typography } from "antd";
import BarChart from "./BarChart.js";
import { scaleImage } from "../../utils/plotHelpers/scaleImage.js";

const { Text } = Typography;

const HighestMeasurementMultiple = ({ state }) => {
  const { organism, organs, celltypes, features, measurement_type, celltypesOrgan, average, score, unit } = state;
  return (
    <div style={{ width: "inherit", alignItems: "center" }}>
      <div style={{ padding: "1% 10%" }}>
        <HighestMeasurementScoreBar state={state} />
      </div>
    </div>
  );
};

export default HighestMeasurementMultiple;