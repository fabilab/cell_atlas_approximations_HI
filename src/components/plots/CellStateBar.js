import React from 'react';
import { downloadSVG } from '../../utils/downLoadSvg';
import Plot from 'react-plotly.js';

const CellStateBar = ({ state }) => {
  let { organism, clickedCellState, celltypes, nCells } = state;

  // array index starts from 0;
  clickedCellState -= 1;

  // extract data from a specific column
  let cellCounts = [];
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

  let plotName = `cellStatePlot(${organism})`;
  let cameraRetro = {
    width: 1000,
    height: 1000,
    path: 'm518 386q0 8-5 13t-13 5q-37 0-63-27t-26-63q0-8 5-13t13-5 12 5 5 13q0 23 16 38t38 16q8 0 13 5t5 13z m125-73q0-59-42-101t-101-42-101 42-42 101 42 101 101 42 101-42 42-101z m-572-320h858v71h-858v-71z m643 320q0 89-62 152t-152 62-151-62-63-152 63-151 151-63 152 63 62 151z m-571 358h214v72h-214v-72z m-72-107h858v143h-462l-36-71h-360v-72z m929 143v-714q0-30-21-51t-50-21h-858q-29 0-50 21t-21 51v714q0 30 21 51t50 21h858q29 0 50-21t21-51z',
    transform: 'matrix(1 0 0 -1 0 850)',
  };

  let config = {
    modeBarButtonsToAdd: [
      {
        name: 'Download plot as SVG',
        icon: cameraRetro,
        click: () => downloadSVG(plotName),
      },
    ],
  }

  return (
      <Plot
        data={[data]}
        layout={layout}
        config={config}
      />
  );
};

export default CellStateBar;
