import React from "react";
import HighestMeasurementScoreBar from "./HighestMeasurementScoreBar";
import HighestMeasurementBubble from "./HighestMeasurementBubble";
import { Button, Tooltip } from 'antd';
import orgMeta from '../../utils/organismMetadata.js';
import { transformData } from "../../utils/plotHelpers/math.js";

const HighestMeasurementMultiple = ({ state }) => {

    let { organism, hasLog, score, average } = state
    let dataSource = orgMeta[organism]?.dataSource || "Data source not available";
    let paperHyperlink = orgMeta[organism]?.paperHyperlink || "Hyperlink unavailable";
    const transformedScore = transformData(score, hasLog);
    const transformedAverage = transformData(average, hasLog);

  return (
    <div style={{ width: "inherit", alignItems: "center" }}>
      <div style={{ padding: "1% 0%" }}>
        <HighestMeasurementScoreBar
          state={{ ...state, score: transformedScore, hasLog }} // Pass transformed score and hasLog
        />
        <Tooltip placement="rightTop" color="#108ee9" title={dataSource} overlayStyle={{ maxWidth: '600px', overflowX: 'auto' }}>
            <Button href={paperHyperlink} target="_blank">Data source</Button>
        </Tooltip>
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