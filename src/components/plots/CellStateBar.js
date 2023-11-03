import React from 'react';
import { downloadSVG } from '../../utils/downLoadSvg';
import Plot from 'react-plotly.js';

const CellStateBar = ({ state }) => {
  let { organism, organ, clickedCellState, celltypes, nCells } = state;

  // array index starts from 0;
  clickedCellState -= 1;

  // extract data from a specific column
  let cellCounts = [];
  console.log(nCells.length);
  for (let i = 0; i < nCells.length; i++) {
    cellCounts.push(nCells[i][clickedCellState]);
  }

  let data = {
    x: cellCounts,
    y: celltypes,
    type: 'bar',
    text: cellCounts.map(String),
    textposition: 'auto',
    hoverinfo: 'none',
    orientation: 'h',
    marker: {
      color: 'rgb(64, 145, 199)',
      opacity: 0.9,
      line: {
        color: 'rgb(204,204,204)',
        width: 1,
      },
    },
  };

  let layout = {
    width: '400',
    height: '450',
    margin: {
      l: 120,
      t: 20,
    },
    title: {
      font: {
        size: 12
      },
      text: `Cell state ${clickedCellState+1}`,
    }
      
  };

  return (
      <Plot
        data={[data]}
        layout={layout}
      />
  );
};

export default CellStateBar;
