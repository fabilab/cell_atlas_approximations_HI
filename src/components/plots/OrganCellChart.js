import React from 'react';
import { useChat } from '../ChatContext'; 
import Plot from 'react-plotly.js';
import {selectAll} from "d3";



const OrganCellChart = ({ apiCellOrgan, organName, measurementType }) => {
  const { setLocalMessage } = useChat();

  // Find the index of the organ, organ cases are different in species
  const organIndex = apiCellOrgan.organs.findIndex(organ => organ.toLowerCase() === organName.toLowerCase());

  // Get cell types and abundances
  let nonZeroData = apiCellOrgan.celltypes.map((cellType, index) => ({
      name: cellType,
      value: apiCellOrgan.detected[index][organIndex]
  }));

  // Restrict to nonzero cell types (necessary because it comes from celltype x organ)
  nonZeroData = nonZeroData.filter(item => item.value > 0);

  // Sort by decreasing abundance
  nonZeroData.sort((item1, item2) => item1.value - item2.value);

  // Prepare for plotly
  const data = [{
      type: 'bar',
      y: nonZeroData.map(item => item.name),
      x: nonZeroData.map(item => item.value),
      orientation: 'h',
      marker: {
          color: 'rgb(64, 145, 199)',
          opacity: 0.9,
          line: {
            color: 'rgb(204,204,204)',
            width: 1,
          },
      },
  }];

  let layout = {
      width: 520,
      height: 180 + 14.8 * nonZeroData.length, //14.7
      xaxis: {
        automargin: true,
        title: {
          text: 'Number of cells detected',
          font: {
            size: 13,
          },
          standoff: 20,
        },
        type: "log",
        range: [-0.2, 4],
      },
      title: {
        text: `<b>Cell type abundance in <span style='color:#0958d9;'>${organName}</span></b>`,
        font: {
          size: 14
        },
      },
      yaxis: {
        automargin: true,
        showticklabels: true,
        type: "category",
        autorange: true
      }
  };

  const yAxisLabelClick = (event) => {
    const clickedCellType = event.target.textContent;
    let message;
    if (measurementType === 'chromatin_accessibility') {
      message = `Show the 10 top marker peaks for ${clickedCellType} in ${apiCellOrgan.organism} ${organName}`
    } else {
      message = `Show 10 markers of ${clickedCellType} in ${apiCellOrgan.organism} ${organName}`;
    }
    setLocalMessage(message);
  };

  
  return (
      <Plot 
          data={data}
          layout={layout}
          onAfterPlot={() => {
            // https://stackoverflow.com/questions/47397551/how-to-make-plotly-js-listen-the-click-events-of-the-tick-labels
            document.querySelectorAll('.plot-container .yaxislayer-above')[0].style.cursor = 'pointer';
            document.querySelectorAll('.plot-container .yaxislayer-above')[0].style['pointer-events'] = 'all';

            selectAll(".yaxislayer-above")
              .selectAll('text')
              .on("click", (event) => yAxisLabelClick(event));
          }}
          onInitialized={(figure, graphDiv)=>{
            document.querySelectorAll('.plot-container .yaxislayer-above')[0].style.cursor = 'pointer';
            document.querySelectorAll('.plot-container .yaxislayer-above')[0].style['pointer-events'] = 'all';

            selectAll(".yaxislayer-above")
              .selectAll('text')
              .on("click", (event) => yAxisLabelClick(event));
          }}
      />
  );
};

export default OrganCellChart;
