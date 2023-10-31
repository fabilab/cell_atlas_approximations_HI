import React from 'react';
import Plot from 'react-plotly.js';

const ClusterPlot = ({ organism, organ, centroids, boundaries }) => {
  let centroidTrace = {
    type: 'scatter',
    mode: 'markers',
    x: centroids.map(point => point[0]),
    y: centroids.map(point => point[1]),
    marker: { color: 'red', size: 8 },
    name: 'Centroids'
  };

  let boundaryTraces = boundaries.map((boundary, index) => ({
    type: 'scatter',
    mode: 'lines+markers',
    x: boundary.map(point => point[0]).concat([boundary[0][0]]), // Close the boundary
    y: boundary.map(point => point[1]).concat([boundary[0][1]]),
    marker: { size: 1 },
    line: { shape: 'spline', smoothing: 1.3 },
    name: `Cluster ${index + 1}`
  }));

  let layout = {
    title: `<b>Approximated cell distribution of ${organism} in organ ${organ}</b>`,
    showlegend: true,
    height: 550,
  };

  return (
    <Plot
      data={[centroidTrace, ...boundaryTraces]}
      layout={layout}
    />
  );
};

export default ClusterPlot;
