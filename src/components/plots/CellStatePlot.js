import React from 'react';
import Plot from 'react-plotly.js';

const CellStatePlot = ({ organism, organ, centroids, boundaries }) => {
  
  let cellStateLabels = centroids.map((_,index) =>  `${index + 1}`);

  let centroidTrace = {
    type: 'scatter',
    mode: 'markers+text',
    x: centroids.map(point => point[0]),
    y: centroids.map(point => point[1]),
    marker: { color: 'red', size: 8 },
    text: cellStateLabels,
    textposition: 'bottom',
    name: 'Centroids',
    hovertemplate: '%{text}<extra></extra>',
    hoverinfo: 'text'
  };
  

  let boundaryTraces = boundaries.map((boundary, index) => ({
    type: 'scatter',
    mode: 'lines+markers',
    x: boundary.map(point => point[0]).concat([boundary[0][0]]), // Close the boundary
    y: boundary.map(point => point[1]).concat([boundary[0][1]]),
    marker: { size: 1 },
    line: { shape: 'spline', smoothing: 1.3 },
    fill: 'toself',
    opacity: 0.5,
    hoverinfo: 'none'
  }));

  let layout = {
    title: `<b>Approximated cell distribution of ${organism} in organ ${organ}</b>`,
    showlegend: false,
    height: 550,
  };

  const handleCentroidClick = (event) => {
    if (event.points && event.points[0] && event.points[0].fullData.name === 'Centroids') {
      console.log('Centroid clicked:', event.points[0].text);
    }
  };

  return (
    <Plot
      data={[centroidTrace, ...boundaryTraces]}
      layout={layout}
      onPlotlyClick={handleCentroidClick}
    />
  );
};

export default CellStatePlot;
