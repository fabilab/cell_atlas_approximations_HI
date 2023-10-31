import React from 'react';
import Heatmap from './Heatmap';
import CellStatePlot from './CellStatePlot';
import BubbleHeatmap from './BubbleHeatmap';

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
  hasLog
}) => {
  console.log(nCells.length);
  const cellStates = [];
  for (let i = 1; i <= nCells[1].length; i++) {
    cellStates.push(`cell state ${i}`);
  } 

  return (
    <div style={{alignItems: "center", padding: "0% 5%"}}>
      <BubbleHeatmap
        mainIntent={mainIntent}
        xaxis={cellStates}
        yaxis={features}
        average={average}
        fractions={fractions}
        organism={organism}
        organ={organ}
        hasLog={hasLog}
      />
      <CellStatePlot
        organism={organism}
        organ={organ}
        centroids={centroids}
        boundaries={boundaries}
      />
    </div>
  );
};

export default Neighborhood;
