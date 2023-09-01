import React from 'react';
import { downloadSVG } from '../../utils/downLoadSvg';
import Plot from 'react-plotly.js';

const BarChart = ({ intent, celltypesOrgan, targetCelltype, average, organism, features, unit }) => {
  let xValue = celltypesOrgan;
  let yValue = average.map((x) => Number(x.toFixed(2)));

  let trace1 = {
    x: xValue,
    y: yValue,
    type: 'bar',
    text: yValue.map(String),
    textposition: 'auto',
    hoverinfo: 'none',
    marker: {
      color: 'rgb(158,202,225)',
      opacity: 0.9,
      line: {
        color: 'rgb(8,48,107)',
        width: 1,
      },
    },
  };

  let data = [trace1];

  let title = '';
  let yLabel = '';
  if (intent === "similar_celltypes.geneExpression") {
    title = `<b>Gene Expression Correlation Analysis for Cell Type Similarity to ${targetCelltype}</b>`;
    yLabel = 'Distance';
  } else if (intent === "highest_measurement.geneExpression") {
    title = `<b>Highest expressor of <a href="https://www.genecards.org/cgi-bin/carddisp.pl?gene=${features}" target="_blank">${features}</a> gene in ${organism}</b>`;
    yLabel = unit;
  } else if (intent === "highest_measurement.chromatinAccessibility" ) {
    title = `<b>Highest expressor of ${features} in ${organism}</b>`;
    yLabel = unit;
  }


  let layout = {
    width: '100%',
    height: '100%',
    xaxis: {
      automargin: true,
      title: {
        text: 'Cell types / Organs',
        font: {
          size: 16,
        },
        standoff: 20,
      },
      tickangle: 90,
    },
    yaxis: {
      title: {
        text: yLabel,
        font: {
          size: 16,
        },
        standoff: 20,
      },
    },
    title: title,
  };

  let cameraRetro = {
    width: 1000,
    height: 1000,
    path: 'm518 386q0 8-5 13t-13 5q-37 0-63-27t-26-63q0-8 5-13t13-5 12 5 5 13q0 23 16 38t38 16q8 0 13 5t5 13z m125-73q0-59-42-101t-101-42-101 42-42 101 42 101 101 42 101-42 42-101z m-572-320h858v71h-858v-71z m643 320q0 89-62 152t-152 62-151-62-63-152 63-151 151-63 152 63 62 151z m-571 358h214v72h-214v-72z m-72-107h858v143h-462l-36-71h-360v-72z m929 143v-714q0-30-21-51t-50-21h-858q-29 0-50 21t-21 51v714q0 30 21 51t50 21h858q29 0 50-21t21-51z',
    transform: 'matrix(1 0 0 -1 0 850)',
  };

  let csvIcon = {
    width: 857.1,
    height: 1000,
    path: 'm214-7h429v214h-429v-214z m500 0h72v500q0 8-6 21t-11 20l-157 156q-5 6-19 12t-22 5v-232q0-22-15-38t-38-16h-322q-22 0-37 16t-16 38v232h-72v-714h72v232q0 22 16 38t37 16h465q22 0 38-16t15-38v-232z m-214 518v178q0 8-5 13t-13 5h-107q-7 0-13-5t-5-13v-178q0-8 5-13t13-5h107q7 0 13 5t5 13z m357-18v-518q0-22-15-38t-38-16h-750q-23 0-38 16t-16 38v750q0 22 16 38t38 16h517q23 0 50-12t42-26l156-157q16-15 27-42t11-49z',
    transform: 'matrix(1 0 0 -1 0 850)',
  };

  let plotName = `barplot(${organism})`;

  let config = {
    modeBarButtonsToAdd: [
      {
        name: 'Download plot as SVG',
        icon: cameraRetro,
        click: () => downloadSVG(plotName),
      },
      {
        name: 'Download data as CSV',
        icon: csvIcon,
        click: function (gd) {
          let csvContent = 'data:text/csv;charset=utf-8,\n';

          // Add column headers
          csvContent += 'Cell types / Organs,Measurements\n';

          // Add data rows
          for (let i = 0; i < xValue.length; i++) {
            csvContent += `${xValue[i]},${yValue[i]}\n`;
          }

          // Create a download link
          const encodedUri = encodeURI(csvContent);
          const link = document.createElement('a');
          link.setAttribute('href', encodedUri);
          link.setAttribute('download', 'bar_chart_data.csv');
          document.body.appendChild(link);

          // Simulate a click on the link to trigger the download
          link.click();

          // Clean up
          document.body.removeChild(link);
        },
      },
    ],
    modeBarButtonsToRemove: ['pan2d','select2d','lasso2d'],
    responsive: true,
    scrollZoom: false,
  };

  return (
      <Plot
        data={data}
        layout={layout}
        config={config}
        // responsive={true}
      />
  );
};

export default BarChart;
