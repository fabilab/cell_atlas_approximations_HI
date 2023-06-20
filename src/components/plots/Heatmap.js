import CanvasXpressReact from 'canvasxpress-react';

// props: arguments passed into React components
const Heatmap = ({ target, xaxis, yaxis, values, organism, organ }) => {  
    let data =  {
        "y" : {
          "vars" : xaxis,
          "smps" : yaxis,
          "data" : values,
        }
      };

    let config = {
      "graphOrientation": "vertical",
      "graphType": "Heatmap",
      "theme": "CanvasXpress",
      "title": `Heatmap of gene expression in ${organism} ${organ}`,
    };

    return (
        <CanvasXpressReact target={target} data={data} config={config} width={500} height={500} />
   )
    

    }

export default Heatmap;