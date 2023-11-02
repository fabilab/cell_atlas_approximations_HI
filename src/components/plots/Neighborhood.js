import React, { useState } from 'react';
import Heatmap from './Heatmap';
import CellStatePlot from './CellStatePlot';
import BubbleHeatmap from './BubbleHeatmap';
import CellStateBar from './CellStateBar';
import { Typography } from 'antd';
const { Text } = Typography;

const Neighborhood = ({
  mainIntent,
  organism,
  organ,
  features,
  celltypes,
  nCells,
  boundaries,
  centroids,
  average,
  fractions,
  hasLog,
  unit
}) => {

  const [clickedCellState, setClickCellState] = useState(null);

  const handleCellStateClick = (cellState) => {
    setClickCellState(cellState);
    console.log("A cell state is being clicked.....");
  };

  const cellStates = [];
  for (let i = 1; i <= nCells[1].length; i++) {
    cellStates.push(`cell state ${i}`);
  }

  return (
    <div style={{  width: "inherit"}}>
      <div style={{padding: "1% 3%"}}>
          <BubbleHeatmap
            mainIntent={mainIntent}
            xaxis={cellStates}
            yaxis={features}
            average={average}
            fractions={fractions}
            organism={organism}
            organ={organ}
            hasLog={hasLog}
            unit={unit}
          />
      </div>
      <div style={{ padding: "1% 1%" }}>
        <div style={{ padding: "0% 1%", display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, overflow: 'auto', minWidth: '0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CellStatePlot
              organism={organism}
              organ={organ}
              centroids={centroids}
              boundaries={boundaries}
              onCellStateHover={handleCellStateClick}
            />
            <Text style={{ alignSelf: 'center' }}>* Click on the centroid (cell state) for cell type abundance information.</Text>
          </div>
          <div style={{ flex: 1, overflow: 'auto', minWidth: '0' }}>
            {clickedCellState !== null &&
              <CellStateBar
                organism={organism}
                organ={organ}
                clickedCellState={clickedCellState}
                celltypes={celltypes}
                nCells={nCells}
              />
            }
          </div>
        </div>
      </div>
    </div>




  );
};

export default Neighborhood;


