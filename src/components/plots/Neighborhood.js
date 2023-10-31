import React from 'react';
import Heatmap from './Heatmap';
import ClusterPlot from './ClusterPlot';

const Neighborhood = ({
  mainIntent,
  organism,
  organ,
  features,
  celltypes,
  nCells,
  boundaries,
  centroids,
  hasLog
}) => {
  // console.log(nCells.length);
  // const xaxis = [];
  // for (let i = 1; i <= nCells[1].length; i++) {
  //   xaxis.push(`cluster ${i}`);
  // } 

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
