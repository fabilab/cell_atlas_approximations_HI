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
    theme: "CanvasXpress",
    title: `Bar chart showing highest expressor of ${gene} gene in ${organism}`,
    smpTitle:"Cell types/Organs",
    "smpLabelRotate":"35",
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