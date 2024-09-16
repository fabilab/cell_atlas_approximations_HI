import React from "react";
import HighestMeasurementScoreBar from "./HighestMeasurementScoreBar";
import HighestMeasurementBubble from "./HighestMeasurementBubble";
import { Typography } from "antd";

const HighestMeasurementMultiple = ({ state }) => {
  const { organism, organs, celltypes, features, measurement_type, celltypesOrgan, average, fractions, score, unit } = state;
  return (
    <div style={{ width: "inherit", alignItems: "center" }}>
      <div style={{ padding: "1% 10%" }}>
        <HighestMeasurementScoreBar state={state} />
        <div style={{ padding: "0% 4%", display: "flex"}}>
        <HighestMeasurementBubble state={state} />
        </div>
      </div>
    </div>
  );
};

export default HighestMeasurementMultiple;