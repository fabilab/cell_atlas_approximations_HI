import React from 'react';
import Plot from 'react-plotly.js';
import { downloadSVG } from '../../utils/downLoadSvg';
import {selectAll} from "d3";

const BubbleHeatmap = ({ state, setHoveredGeneColor, setHoveredGene }) => {

  let { plotType, xaxis, yaxis, average, fractions, organism, organ, celltype, unit, hasLog, measurement_type } = state;
  console.log(plotType);
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
    all_color = all_color.concat(average[i].map(value => Number(value.toFixed(3))));
    all_size = all_size.concat(fractions[i].map((x) => (x * 100).toFixed(3)));
    const text = xaxis.map((celltype, index) => {
      return `gene: ${yaxis[i]}<br>${yHover}: ${celltype}<br>expression: ${average[i][index].toPrecision(3)}<br>fraction: ${(fractions[i][index] * 100).toFixed(3)}%`;
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
    margin: {
      t: 30,
      b: 10,
      l: 5,
      r: 5,
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

  let csvIcon = {
    'width': 857.1,
    'height': 1000,
        'path': 'm214-7h429v214h-429v-214z m500 0h72v500q0 8-6 21t-11 20l-157 156q-5 6-19 12t-22 5v-232q0-22-15-38t-38-16h-322q-22 0-37 16t-16 38v232h-72v-714h72v232q0 22 16 38t37 16h465q22 0 38-16t15-38v-232z m-214 518v178q0 8-5 13t-13 5h-107q-7 0-13-5t-5-13v-178q0-8 5-13t13-5h107q7 0 13 5t5 13z m357-18v-518q0-22-15-38t-38-16h-750q-23 0-38 16t-16 38v750q0 22 16 38t38 16h517q23 0 50-12t42-26l156-157q16-15 27-42t11-49z',
    'transform': 'matrix(1 0 0 -1 0 850)'
  };


// Define CSV file structure based on plotType
let plotName = '';
let csvRowTitle = '';
switch (plotType) {
  case 'fractionDetected':
    csvRowTitle = `Cell types,Gene symbols,Expression(${unit}),Fraction(%)`;
    plotName = `dotplot_${organism}_${organ}`;
    break;
  case 'fractionDetectedAcrossOrgans':
    csvRowTitle = `Organs,Gene symbols,Expression(${unit}),Fraction(%)`;
    plotName = `dotplot_${organism}_${celltype}`;
    break;
  case 'neighborhood':
    csvRowTitle = `Cell states,Gene symbols,Expression(${unit}),Fraction(%)`;
    plotName = `dotplot_${organism}_${organ}`;
    break;
  default:
    break;
}

  let config = {
    modeBarButtons: [
      ['toImage'], 
      [{
        name: 'Download plot as SVG',
        icon: cameraRetro,
        click: () => downloadSVG(plotName),
      }],
      [{
        name: 'Download data as CSV',
        icon:  csvIcon,
        click: function(gd) {
          const csvContent = [csvRowTitle];
          for (let i = 0; i < all_x.length; i++) {
            const rowData = [all_x[i], all_y[i], all_color[i], all_size[i]];
            const csvRow = rowData.map(String).join(',');
            csvContent.push(csvRow);
          }
          const csvString = csvContent.join('\n');
          const blob = new Blob([csvString], { type: 'text/plain' });
          const a = document.createElement('a');
          const objectURL = URL.createObjectURL(blob);
          a.href = objectURL;
          a.download = `${plotName}.csv`;
          document.body.appendChild(a);
          a.click();
          URL.revokeObjectURL(objectURL);
          document.body.removeChild(a);
        },
      }],
    ],
    responsive: true,
    scrollZoom: false,
  };

  // The following part should only be implement when user is looking at the neighhood page:
  if (setHoveredGeneColor && setHoveredGene) {
    const normalizeArray = (matrix) => {
      const flatten = matrix.flat();
      const maxValue = Math.max(...flatten);
    
      return matrix.map(row =>
        row.map(value => (value/maxValue))
      );
    }

    // from: https://github.com/plotly/plotly.js
    // Code generated by chatGTP:
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
      const normalisedAverage = normalizeArray(average);
      const colors = normalisedAverage[yaxis.indexOf(selected)].map(a => mapToColor(a))
      setHoveredGeneColor(colors);
      setHoveredGene(selected);
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
  } else {
    return (
      <Plot
        data={[data]}
        layout={layout}
        config={config}
      />
    );
  }
};

export default BubbleHeatmap;
