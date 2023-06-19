import Plotly from 'plotly.js-dist';
import Plot from 'react-plotly.js';
//import CanvasXpressReact from 'canvasxpress-react';

// props: arguments passed into React components
const Heatmap = ({ target, xaxis, yaxis, values, organism, organ }) => {

    let data =  {
        "y" : {
          "vars" : xaxis,
          "smps" : yaxis,
          "data" : values,
        }
      };

    let nx = data.y.data[0].length;
    let width = 50 + 30 * nx;
    let ny = data.y.data.length;
    let height = 50 + 30 * ny;

    let layout = {
        width,
        height,
        autosize: true,
        margin: {
            l: 30,
            r: 0,
            b: 0,
            t: 0,
            pad: 4,
        },
        xaxis: {
            autorange: true,
            automargin: true,
            tickangle: 270,
            type: 'category',
        },
        yaxis: {
            autorange: 'reversed',
            type: 'category',
            automargin: false,
            scaleanchor: 'x',
            scaleratio: 1,
        },
    };

    // Config for plotly
    let config = {
      scrollZoom: false,
      editable: false,
      staticPlot: false,
      responsive: true,
      modeBarButtonsToRemove: ['toImage'],
      modeBarButtonsToAdd: [
        {
          name: 'Download plot as a PNG',
          icon: Plotly.Icons.camera,
          click: function(gd) {
            Plotly.downloadImage(gd, {format: 'png'})
          }
        },
        {
          name: 'Download plot as an SVG',
          icon: Plotly.Icons.camera,
          click: function(gd) {
            Plotly.downloadImage(gd, {format: 'svg'})
          }
        },
      ],
    }

    return (
        <Plot
            data={[
              {
                x: xaxis,
                y: yaxis,
                z: values,
                type: "heatmap",
              }
            ]}
            layout={ layout }
            config={ config }
        />
   )
}

//const HeatmapCE = ({ target, xaxis, yaxis, values, organism, organ }) => {
//
//    let data =  {
//        "y" : {
//          "vars" : xaxis,
//          "smps" : yaxis,
//          "data" : values,
//        }
//      };
//
//    let nx = data.y.data[0].length;
//    let width = 50 + 30 * nx;
//    let ny = data.y.data.length;
//    let height = 50 + 30 * ny;
//
//    let config = {
//        "graphOrientation": "vertical",
//        "graphType": "Heatmap",
//        "theme": "CanvasXpress",
//        "title": "Heatmap of gene expression in " + organism + " " + organ,
//    };
//
//    return (
//        <CanvasXpressReact
//            target={target}
//            data={data}
//            config={config}
//            width={width}
//            height={height}
//        />
//   )
//}

export default Heatmap
