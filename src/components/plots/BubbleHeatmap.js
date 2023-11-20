import React from 'react';
import Plot from 'react-plotly.js';
import { downloadSVG } from '../../utils/downLoadSvg';
import {selectAll} from "d3";
import { useState } from 'react';

const BubbleHeatmap = ({ state, onGeneHover }) => {
  let { plotType, xaxis, yaxis, average, fractions, organism, organ, celltype, unit, hasLog, measurement_type } = state;
  const [selectedGene, setSelectedGene] = useState(null);
  const geneCardLink = (gene) => `https://www.genecards.org/cgi-bin/carddisp.pl?gene=${gene}`;
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

  let title = "";
  let yHover;

  if (plotType === "neighborhood") {
    yHover = "cell state";
  } else {
    switch (measurement_type) {
      case "chromatin_accessibility":
        if (celltype) {
          yHover = "organ";
          title = `<b>Chromatin accessibility in <i>${celltype}</i> across ${organism} organs<b>`
        } else {
          yHover = "cell type";
          title = `<b>Chromatin accessibility in ${organism} ${organ} by cell type</b>`;
        }
        break;
      default:
        if (celltype) {
          yHover = "organ";
          title = `<b>Gene expression in <i>${celltype}</i> across ${organism} organs<b>`
        } else {
          yHover = "cell type";
          title = `<b>Gene expression in ${organism} ${organ} by cell type</b>`;
        }
    }
  }

  for (let i = 0; i < yaxis.length; i++) {
    all_x = all_x.concat(xaxis);
    all_y = all_y.concat(Array(xaxis.length).fill(yaxis[i]));
    all_color = all_color.concat(average[i]);
    all_size = all_size.concat(fractions[i].map((x) => x.toPrecision(3) * 100));

    const text = xaxis.map((celltype, index) => {
      return `gene: ${yaxis[i]}<br>${yHover}: ${celltype}<br>expression: ${average[i][index].toPrecision(3)}<br>fraction: ${fractions[i][index].toPrecision(3) * 100}%`;
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

  let nfeatures = yaxis.length;
  let ncelltypes = xaxis.length;

  let ytickMargin = (nfeatures <= 10) ? 200 : 200;
  let xtickMargin = (ncelltypes <= 20) ? 380 : 170;

  let graphWidth = ncelltypes * 30 + xtickMargin;
  let graphHeight = nfeatures * 30 + ytickMargin;


  let layout = {
    width: graphWidth,
    height: graphHeight,
    xaxis: {
      automargin: true,
      tickangle: 270,
    },
    yaxis: {
      automargin: true,
      tickmode: 'array',
      ticktext: yTickTexts,
      tickvals: yTickVals,
    },
    title: {
      text: title,
      font: {
        size: 16
      },
    },
  };

  const desired_maximum_marker_size = 6.2;

  if(hasLog) {
    all_color = all_color.map(value => Math.log(value));
    unit = "log( " + unit + " )";
  }
  
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
      colorbar: {title: {
        text: unit,
        titleside: "bottom",
      },
      len: 1
      },
    },
    text: all_hovertext,
    hoverinfo: 'text',
  };

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
    responsive: true,
    scrollZoom: false,
  };

  const normalizeArray = (matrix) => {
    const flatten = matrix.flat();
    const minValue = Math.min(...flatten);
    const maxValue = Math.max(...flatten);
  
    return matrix.map(row =>
      row.map(value => (value/maxValue))
    );
  }

  const mapToColor = (value) => {
    const YlGnBu = [
      [0, 'rgb(8,29,88)'], [0.125, 'rgb(37,52,148)'],
      [0.25, 'rgb(34,94,168)'], [0.375, 'rgb(29,145,192)'],
      [0.5, 'rgb(65,182,196)'], [0.625, 'rgb(127,205,187)'],
      [0.75, 'rgb(199,233,180)'], [0.875, 'rgb(237,248,217)'],
      [1, 'rgb(255,255,217)']
    ]

    value = 1 - value;

    for (let i = 1; i < YlGnBu.length; i++) {
      if (value <= YlGnBu[i][0]) {
        const [v1, color1] = YlGnBu[i - 1];
        const [v2, color2] = YlGnBu[i];
        const t = (value - v1) / (v2 - v1);
        const interpolateComponent = (c1, c2) => Math.round(c1 + t * (c2 - c1));
        const interpolateColor = (rgb1, rgb2) => rgb1.map((c, i) => interpolateComponent(c, rgb2[i]));
        return `rgb(${interpolateColor(color1.match(/\d+/g).map(Number), color2.match(/\d+/g).map(Number)).join(',')})`;
      }
    }
    return YlGnBu[YlGnBu.length - 1][1];
  }

  const geneHover = (event) => {
    const selected = event.target.textContent;
    if (selected === selectedGene) {
      return;
    }
    const normalisedAverage = normalizeArray(average);
    const colors = normalisedAverage[yaxis.indexOf(selected)].map(a => mapToColor(a))
    onGeneHover(colors);
    setSelectedGene(selected);
  }

  return (
    <Plot
      data={[data]}
      layout={layout}
      config={config}
      onAfterPlot={() => {
        document.querySelectorAll('.plot-container .yaxislayer-above')[0].style.cursor = 'pointer';
        document.querySelectorAll('.plot-container .yaxislayer-above')[0].style['pointer-events'] = 'all';
        selectAll(".yaxislayer-above")
          .selectAll('text')
          .on("mouseenter", (event) => geneHover(event));
      }}
      onInitialized={(figure, graphDiv)=>{
        selectAll(".yaxislayer-above")
          .selectAll('text')
          .on("mouseenter", (event) => geneHover(event));
      }}
    />
  );
};

export default BubbleHeatmap;
