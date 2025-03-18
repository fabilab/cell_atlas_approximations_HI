import React from "react";
import HighestMeasurementScoreBar from "./HighestMeasurementScoreBar";
import HighestMeasurementBubble from "./HighestMeasurementBubble";
import { transformData } from "../../utils/plotHelpers/math.js";
import DataSource from '../../utils/plotHelpers/dataSource.js';

const HighestMeasurementMultiple = ({ state }) => {

    let { organism, hasLog, score, average } = state
    const transformedScore = transformData(score, hasLog);
    const transformedAverage = transformData(average, hasLog);

  return (
    <div style={{ width: "inherit", alignItems: "center" }}>
      <div style={{ padding: "1% 0%" }}>
        <HighestMeasurementScoreBar
          state={{ ...state, score: transformedScore, hasLog }} // Pass transformed score and hasLog
        />
        <DataSource organism={organism} />
        <div style={{ padding: "1% 0%" }}>
          <HighestMeasurementBubble
            state={{ ...state, average: transformedAverage, hasLog }} // Pass transformed score and hasLog
          />
        </div>
      </div>
    </div>
  );
};

export default HighestMeasurementMultiple;