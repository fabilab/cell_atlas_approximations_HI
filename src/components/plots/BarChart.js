import CanvasXpressReact from 'canvasxpress-react';

const BarChart = ({ target, xaxis, average, organism, gene }) => { 
  
  let data =  {
      "y" : {
        "vars" : [gene],
        "smps": xaxis,
        "data" : [average],
      }
    };

  let config = {
    graphOrientation: "vertical",
    graphType: "Bar",
    theme: "paulTol",
    title: `Highest expressor of ${gene} gene in ${organism}`,
    smpTitle:"Cell types/Organs",
    "fontName": "Times New Roman",
    "plotBoxColor": "pink",
    // graphackgroundColor: "white",
    // "graphOrientation": "vertical",
    // "showLegend": false,
    // "smpLabelRotate": 90,
    // "smpTitle": "Samples",
    // "theme": "paulTol",
    // "title": "Bar Graph Title",
    // "xAxis": ["V1"],
    // "xAxisTitle": "Value",
    // "graphType": "Bar"
  };

  return (
    <CanvasXpressReact 
      target={target} 
      data={data} 
      config={config}
    />
  );
};

export default BarChart;