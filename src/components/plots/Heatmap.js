import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { downloadSVG } from '../../utils/downLoadSvg';

const Heatmap = ({ subIntent, dataCategory, xaxis, yaxis, values, organism, organ, celltype, unit, measurementType, hasLog }) => {
  console.log(subIntent);
  console.log(dataCategory);
  const [plotData, setData] = useState(null);
  const [plotLayout, setLayout] = useState(null);
  const [plotConfig, setConfig] = useState(null);


  const geneCardLink = (gene) =>
    `https://www.genecards.org/cgi-bin/carddisp.pl?gene=${gene}`;
  
  
  useEffect(() => {
    const yTickTexts = yaxis.map((gene) => {
      const link = geneCardLink(gene);
      return `<a href="${link}" target="_blank">${gene}</a>`;
    });
    const yTickVals = yaxis.map((_, index) => index);
  
    // Apply log transform to data is requested by user
    if (hasLog) {
      values = values.map(subArray => subArray.map(value => Math.log(value)));
      unit = "log( " + unit + " )";
    } 

    let data = [
      {
        z: values,
        x: xaxis,
        y: yaxis,
        type: 'heatmap',
        colorscale: 'Reds',
        // get unit from API call
        colorbar: {
          title: {
            text: unit,
          }
        },
        hovertemplate:
          "Gene: %{y} <br>" +
          "Cell type: %{x} <br>" +
          "Expression: %{z}" +
          "<extra></extra>"
      }
    ];
  
    let longestXlabel = 0, longestYlabel = 0;
    for (let i = 0; i < xaxis.length; i++) {
      longestXlabel = Math.max(longestXlabel, xaxis[i].length);
    }
    for (let i = 0; i < yaxis.length; i++) {
      longestYlabel = Math.max(longestYlabel, yaxis[i].length);
    }
  
    // Calculate suitable cell size
    const pxCell = 17; // Adjust this value as needed
    const ncelltypes = xaxis.length;
    const nfeatures = yaxis.reduce((acc, a) => acc + a.length, 0);

    // Calculate graph width and height
    const ytickMargin = 100;
    const xtickMargin = 100;
    const graphWidth = ytickMargin + pxCell * ncelltypes + 400;
    const graphHeight = nfeatures * pxCell * 0.6 + xtickMargin;
    
    let title = "";
    if (subIntent === 'geneExpression') {
      if (dataCategory === "across_organs") {
        title = `<b>Gene expression variation in <i>${celltype}</i> across ${organism} organs<b>`
      } else {
        title = `<b>Heatmap of gene expression in ${organism} ${organ}</b>`;
      }
    } else {
      title = `<b>Heatmap of chromatin accessibility in ${organism} ${organ}</b>`;
    }

    let layout = {
      width: graphWidth,
      height: `${graphHeight}`,
      xaxis: {
        autorange: true,
        automargin: true,
      },
      yaxis: {
        automargin: true,
        tickmode: 'array',
        ticktext: yTickTexts,
        tickvals: yTickVals,
      },
      title: title,
    };
  
    let cameraRetro= {
    'width': 1000,
    'height': 1000,
    'path': 'm518 386q0 8-5 13t-13 5q-37 0-63-27t-26-63q0-8 5-13t13-5 12 5 5 13q0 23 16 38t38 16q8 0 13 5t5 13z m125-73q0-59-42-101t-101-42-101 42-42 101 42 101 101 42 101-42 42-101z m-572-320h858v71h-858v-71z m643 320q0 89-62 152t-152 62-151-62-63-152 63-151 151-63 152 63 62 151z m-571 358h214v72h-214v-72z m-72-107h858v143h-462l-36-71h-360v-72z m929 143v-714q0-30-21-51t-50-21h-858q-29 0-50 21t-21 51v714q0 30 21 51t50 21h858q29 0 50-21t21-51z',
    transform: 'matrix(1 0 0 -1 0 850)'
    };
  
    let csvIcon = {
      'width': 857.1,
      'height': 1000,
          'path': 'm214-7h429v214h-429v-214z m500 0h72v500q0 8-6 21t-11 20l-157 156q-5 6-19 12t-22 5v-232q0-22-15-38t-38-16h-322q-22 0-37 16t-16 38v232h-72v-714h72v232q0 22 16 38t37 16h465q22 0 38-16t15-38v-232z m-214 518v178q0 8-5 13t-13 5h-107q-7 0-13-5t-5-13v-178q0-8 5-13t13-5h107q7 0 13 5t5 13z m357-18v-518q0-22-15-38t-38-16h-750q-23 0-38 16t-16 38v750q0 22 16 38t38 16h517q23 0 50-12t42-26l156-157q16-15 27-42t11-49z',
      'transform': 'matrix(1 0 0 -1 0 850)'
  
    };
      
  
    let plotName = `heatmap(${organism}-${organ})`;
    let config = {
      modeBarButtons: [['toImage'], [
        {
          name: 'Download plot as SVG',
          icon: cameraRetro,
          click: () => downloadSVG(plotName),
        },
      {
      name: 'Download data as CSV',
      icon:  csvIcon,
      click: function(gd) {
        let text = 'Gene,' + gd.data[0].x.join(',') + '\n';
        for (let i = 0; i < gd.data[0].y.length; i++) {
        text += gd.data[0].y[i] + ',' + gd.data[0].z[i].join(',') + '\n';
        }
        const blob = new Blob([text], { type: 'text/plain' });
        const a = document.createElement('a');
        const objectURL = URL.createObjectURL(blob);
        a.href = objectURL;
        a.download = 'expression_data.csv';
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(objectURL);
        document.body.removeChild(a);
      },
      }
      ]],
      responsive: true,
      scrollZoom: false,
    };
  
    setData(data);
    setLayout(layout);
    setConfig(config);
  }, [xaxis, yaxis, values, organism, organ, unit, hasLog])

  if (plotData && plotLayout && plotConfig) {
    return (
      <Plot
        data={plotData}
        layout={plotLayout}
        config={plotConfig}
      />
    );
  } else {
    return <>Loading</>
  }
  
};

export default Heatmap;
