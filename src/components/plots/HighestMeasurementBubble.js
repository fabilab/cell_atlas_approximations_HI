import React from 'react';
import Plot from 'react-plotly.js';

const customDotScale = (fractions) => {
  return 25 * Math.pow(fractions / 100.0, 1/4);
};

const YlGnBu = [
  [0, 'rgb(8,29,88)'], [0.125, 'rgb(37,52,148)'],
  [0.25, 'rgb(34,94,168)'], [0.375, 'rgb(29,145,192)'],
  [0.5, 'rgb(65,182,196)'], [0.625, 'rgb(127,205,187)'],
  [0.75, 'rgb(199,233,180)'], [0.875, 'rgb(226,247,188)'],
  [1, 'rgb(250,245,182)']
];

const BubbleHeatmap = ({ state }) => {
  let { celltypesOrgan, features, average, fraction_detected, organism, unit, hasLog } = state;

  if (hasLog) {
    average = average.map((row) => row.map((value) => Math.log10(value)));
    unit = "log( " + unit + " )";
  }

  let all_x = [];
  let all_y = [];
  let all_color = [];
  let all_size = [];
  let all_hovertext = [];

  for (let i = 0; i < features.length; i++) {
    all_x = all_x.concat(celltypesOrgan);
    all_y = all_y.concat(Array(celltypesOrgan.length).fill(features[i]));
    all_color = all_color.concat(average[i].map(value => Number(value.toFixed(3))));
    all_size = all_size.concat(fraction_detected[i].map((x) => customDotScale(x * 100)));
    const text = celltypesOrgan.map((cellTypeOrgan, index) => {
      return `gene: ${features[i]}<br>cell type/organ: ${cellTypeOrgan}<br>expression:${average[i][index]} <br>fraction: ${(fraction_detected[i][index] * 100).toFixed(3)}%`;
    });
    all_hovertext = all_hovertext.concat(text);
  }

  let layout = {
    width: celltypesOrgan.length * 40 + 380,
    height: features.length * 40 + 250,
    xaxis: {
      automargin: true,
      tickangle: 270,
      title: {
        text: 'Cell types(Organs)',
        standoff: 20
      },
    },
    yaxis: {
      automargin: true,
      autorange: 'reversed',
      title: {
        text: "Genes",
        standoff: 20
      },
    },
    title: `Gene expression and fraction across highest expressors in ${organism}`,
  };
  

  let data = {
    x: all_x,
    y: all_y,
    mode: 'markers',
    marker: {
      color: all_color,
      size: all_size,
      sizeref: 2 * Math.max(...all_size) / (6.2 ** 2),
      colorscale: YlGnBu,
      reversescale: true,
      colorbar: {title: {text: unit, titleside: "bottom"}},
    },
    text: all_hovertext,
    hoverinfo: 'text',
  };

  return (
    <Plot
      data={[data]}
      layout={layout}
      config={{responsive: true}}
    />
  );
};

export default BubbleHeatmap;