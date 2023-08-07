import React from 'react';
import Plot from 'react-plotly.js';
import { downloadSVG } from '../../utils/downLoadSvg';

const BubbleHeatmap = ({ xaxis, yaxis, average, fractions, organism, organ }) => {
  const geneCardLink = (gene) => `https://www.genecards.org/cgi-bin/carddisp.pl?gene=${gene}`;

  console.log("Bubble heatmap line 8")
  console.log(xaxis);
  const yTickTexts = yaxis.map((gene) => {
    const link = geneCardLink(gene);
    return `<a href="${link}" target="_blank">${gene}</a>`;
  });

  const yTickVals = yaxis.map((_, index) => index);

  let all_x = [];
  let all_y = [];
  let all_color = [];
  let all_size = [];
  let all_hovertext = [];

  for (let i = 0; i < yaxis.length; i++) {
    all_x = all_x.concat(xaxis);
    all_y = all_y.concat(Array(xaxis.length).fill(yaxis[i]));
    all_color = all_color.concat(average[i]);
    all_size = all_size.concat(fractions[i].map((x) => x.toPrecision(3) * 100));

    const text = xaxis.map((celltype, index) => {
      return `Gene: ${yaxis[i]}<br>Cell Type: ${celltype}<br>Avg Exp: ${average[i][index].toPrecision(3)}<br>Proportion: ${fractions[i][index].toPrecision(3) * 100}%`;
    });

    all_hovertext = all_hovertext.concat(text);
  }

  let longestXlabel = 0, longestYlabel = 0;
  for (let i = 0; i < xaxis.length; i++) {
    longestXlabel = Math.max(longestXlabel, xaxis[i].length);
  }

  for (let i = 0; i < yaxis.length; i++) {
    longestYlabel = Math.max(longestYlabel, yaxis[i].length);
  }

  let nfeatures = yaxis.reduce((acc, a) => acc + a.length, 0);
  let ncelltypes = xaxis.length;
  let pxCell = 17, pxChar = 10;
  let ytickMargin = pxChar * longestYlabel;
  let xtickMargin = pxChar * longestXlabel;
  let graphWidth = ytickMargin + pxCell * ncelltypes + 400;
  let graphHeight = pxCell * nfeatures * 0.3 + xtickMargin;

  let layout = {
    width: graphWidth,
    height: graphHeight,
    xaxis: {
      automargin: true,
      title: {
        text: 'Cell types',
        font: {
          size: 17,
        },
        standoff: 20,
      },
      tickangle: 90,
    },
    yaxis: {
      automargin: true,
      title: {
        text: 'Genes',
        font: {
          size: 17,
        },
        standoff: 20,
      },
      tickmode: 'array',
      ticktext: yTickTexts,
      tickvals: yTickVals,
    },
    title: `<b>Bubble heatmap showing gene expression and fraction in ${organism} ${organ}</b>`,
  };

  const desired_maximum_marker_size = 6.2;

  let data = {
    x: all_x,
    y: all_y,
    mode: 'markers',
    marker: {
      color: all_color,
      size: all_size,
      sizeref: 2 * Math.max(...all_size) / (desired_maximum_marker_size ** 2),
      colorscale: 'YlGnBu',
      reversescale: true,
      colorbar: {},
    },
    text: all_hovertext,
    hoverinfo: 'text',
  };

  // console.log(`<b>Bubble heatmap showing gene expression and fraction in ${organism} ${organ}</b>`);

  let cameraRetro = {
    'width': 1000,
    'height': 1000,
    'path': 'm518 386q0 8-5 13t-13 5q-37 0-63-27t-26-63q0-8 5-13t13-5 12 5 5 13q0 23 16 38t38 16q8 0 13 5t5 13z m125-73q0-59-42-101t-101-42-101 42-42 101 42 101 101 42 101-42 42-101z m-572-320h858v71h-858v-71z m643 320q0 89-62 152t-152 62-151-62-63-152 63-151 151-63 152 63 62 151z m-571 358h214v72h-214v-72z m-72-107h858v143h-462l-36-71h-360v-72z m929 143v-714q0-30-21-51t-50-21h-858q-29 0-50 21t-21 51v714q0 30 21 51t50 21h858q29 0 50-21t21-51z',
    'transform': 'matrix(1 0 0 -1 0 850)',
  };

  let plotName = `dotplot(${organism}-${organ})`;
  let config = {
    modeBarButtonsToAdd: [
      {
        name: 'Download plot as SVG',
        icon: cameraRetro,
        click: () => downloadSVG(plotName),
      },
    ],
    editable: true,
    responsive: true,
    scrollZoom: true,
  };

  return (
    <Plot
      data={[data]}
      layout={layout}
      config={config}
    />
  );
};

export default BubbleHeatmap;
