import React, { useEffect } from 'react';
import Plot from 'react-plotly.js';
import * as d3 from 'd3';

const CellStatePlot = ({ organism, organ, centroids, boundaries, onCellStateClick }) => {
  
   
  let cellStateLabels = centroids.map((_,index) =>  `${index + 1}`);

  let centroidTrace = {
    type: 'scatter',
    mode: 'markers+text',
    x: centroids.map(point => point[0]),
    y: centroids.map(point => point[1]),
    marker: { color: 'black', size: 12, symbol: 'star' },
    text: cellStateLabels,
    textposition: 'top',
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
    showlegend: false,
    height: 450,
    width: 450,
    xaxis: {
      zeroline: false,
      showticklabels: false,
    },
    yaxis: {
      zeroline: false,
      showticklabels: false,
    },
    margin: {
      t: 10,
      b: 10,
      l: 5,
      r: 5,
    }
  };


  const handleCentroidClick = (event) => {
    console.log(event);
    const clickedText = event.target.textContent;
    onCellStateClick(clickedText);
    console.log("Clicking centroid: " + clickedText);
  };

  // Make centroid text clickable: Code from "https://chat.openai.com/"
  useEffect(() => {
    const labels = document.querySelectorAll('.scatterlayer .text text');

    labels.forEach((label) => {
      label.style.cursor = 'pointer';
      label.style['pointer-events'] = 'all';
      label.addEventListener('click', (event) => {
        handleCentroidClick(event);
      });
    });
  }, []);

  return (
    <Plot
      data={[centroidTrace, ...boundaryTraces]}
      layout={layout}
      config={{ displayModeBar: false }}
    />
  );
};

export default CellStatePlot;

