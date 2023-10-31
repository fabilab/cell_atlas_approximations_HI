import React from 'react';
import Heatmap from './Heatmap';
import ClusterPlot from './ClusterPlot';
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
  const xaxis = [];
  for (let i = 1; i <= nCells[1].length; i++) {
    xaxis.push(`cell state ${i}`);
  } 

  return (
    <div style={{alignItems: "center", padding: "0% 5%"}}>
      {/* <Heatmap
        mainIntent={mainIntent}
        xaxis={xaxis}
        yaxis={celltypes}
        values={nCells}
        organism={organism}
        organ={organ}
        hasLog={hasLog}
      /> */}
      <BubbleHeatmap
        mainIntent={mainIntent}
        xaxis={xaxis}
        yaxis={features}
        average={average}
        fractions={fractions}
        organism={organism}
        organ={organ}
        hasLog={hasLog}
      />
      <ClusterPlot
        organism={organism}
        organ={organ}
        centroids={centroids}
        boundaries={boundaries}
      />
    </div>
  );
};

export default Neighborhood;
