import CanvasXpressReact from 'canvasxpress-react';

const Heatmap = ({ target, xaxis, yaxis, values, organism, organ }) => {  
  let data =  {
      "y" : {
        "vars" : xaxis,
        "smps" : yaxis,
        "data" : values,
      }
    };

  let config = {
    graphOrientation: "vertical",
    graphType: "Heatmap",
    theme: "CanvasXpress",
    title: `Heatmap of gene expression in ${organism} ${organ}`,

  };

  return (
    <CanvasXpressReact 
      target={target} 
      data={data} 
      config={config} 
    />
  )
}

export default Heatmap;