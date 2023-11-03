import React, { useEffect } from 'react';
import Plot from 'react-plotly.js';

const CellStatePlot = ({ state }) => {
  let { centroids, boundaries, onCellStateHover } = state;

  const cellStateLabels = centroids.map((_, index) => `${index + 1}`);

  const centroidTrace = {
    type: 'scatter',
    mode: 'markers+text',
    x: centroids.map((point) => point[0]),
    y: centroids.map((point) => point[1]),
    marker: { color: 'black', size: 12, symbol: 'star' },
    text: cellStateLabels,
    textposition: 'top',
    name: 'Centroids',
    hovertemplate: '%{text}<extra></extra>',
    hoverinfo: 'text',
  };

  const boundaryTraces = boundaries.map((boundary, index) => {
    return {
      type: 'scatter',
      mode: 'lines+markers',
      x: boundary.map((point) => point[0]).concat([boundary[0][0]]),
      y: boundary.map((point) => point[1]).concat([boundary[0][1]]),
      marker: { size: 1 },
      line: { shape: 'spline', smoothing: 1.3 },
      fill: 'toself',
      opacity: 0.5,
      hoverinfo: 'none',
      ids: Array(boundary.length).fill(cellStateLabels[index]),
    };
  });

  const layout = {
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
    },
  };

  const handleCellStateHover = (event) => {
    console.log(event);
    const clickedText = event.target.textContent || event.target.id;
    onCellStateHover(clickedText);
  };

  const loadEventListeners = () => {
    const fills = document.querySelectorAll('.scatterlayer .fills g path');
    fills.forEach((f, key)=>{
      f.setAttribute('id', key+1);
    })

    const labels = document.querySelectorAll('.scatterlayer .text text, .scatterlayer .fills');
    labels.forEach((label) => {
      label.style.cursor = 'pointer';
      label.style['pointer-events'] = 'all';
      label.addEventListener('mouseover', (event) => {
        handleCellStateHover(event);
      });
    });
  }

  return (
    <Plot 
      data={[centroidTrace, ...boundaryTraces]} 
      layout={layout} 
      onInitialized={(figure, graphDiv) => loadEventListeners()}
    />
  );
};

export default CellStatePlot;
