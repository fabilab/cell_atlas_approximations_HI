import React, { useState } from 'react';
import CellStatePlot from './CellStatePlot';
import BubbleHeatmap from './BubbleHeatmap';
import CellStateBar from './CellStateBar';
import { Typography } from 'antd';
const { Text } = Typography;

const Neighborhood = ({ state }) => {
  let {
    organism,
    organ,
    features,
    celltypes,
    nCells,
    boundaries,
    centroids,
    average,
    fractions,
    unit,
    measurement_type,
    hasLog,
  } = state;

  const [clickedCellState, setClickCellState] = useState(null);

  const handleCellStateClick = (cellState) => {
    setClickCellState(cellState);
    //console.log("A cell state is being clicked.....");
  };

  const cellStates = [];
  for (let i = 1; i <= nCells[1].length; i++) {
    cellStates.push(`cell state ${i}`);
  }

  let bubbleState  = {
    plotType: "neighborhood",
    xaxis: cellStates,
    yaxis: features,
    organism,
    organ,
    unit,
    measurement_type,
    hasLog,
    average,
    fractions,
  };

  let embeddingState = {
    organism,
    organ,
    centroids,
    boundaries,
    onCellStateHover: handleCellStateClick
  };

  let cellBarState = {
    organism,
    organ,
    clickedCellState,
    celltypes,
    nCells,
  };

  return (
    <div style={{ width: "inherit", alignItems: "center" }}>
      <div style={{padding: "1% 3%" }}>
          <BubbleHeatmap
            state={bubbleState}
          />
      </div>
      <div style={{ padding: "1% 1%" }}>
        <div style={{ padding: "0% 1%", display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, overflow: 'auto', minWidth: '0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CellStatePlot
              state={embeddingState}
            />
            <Text style={{ alignSelf: 'center' }}>* Hover over the cell states for cell type abundance information.</Text>
          </div>
          <div style={{ flex: 1, overflow: 'auto', minWidth: '0' }}>
            {clickedCellState !== null &&
              <CellStateBar
                state={cellBarState}
              />
            }
          </div>
        </div>
      </div>
    </div>




  );
};

export default Neighborhood;


