import CanvasXpressReact from 'canvasxpress-react';

// average: data, fraction: data2
const BubbleHeatmap = ({ target, xaxis, yaxis, average, fractions, organism, organ }) => { 
    console.log("start generating plot for..." + organism + "---" + organ + "---" + yaxis); 
    let data =  {
        "y" : {
          "vars" : xaxis,
          "smps" : yaxis,
          "data" : average,
          "data2": fractions,
        }
      };
      console.log(average);
      console.log(fractions);

    let config = {
     "graphType":"Heatmap",
     "guides":"true",
     "heatmapIndicatorPosition":"top",
     "legendKeyBackgroundBorderColor":"rgba(255,255,255,0)",
     "legendKeyBackgroundColor":"rgba(255,255,255,0)",
     "objectBorderColor":"rgb(0,0,0)",
     "samplesClustered":"true",
     "showSmpDendrogram":"false",
     "showVarDendrogram":"false",
     "sizeBy":"Size",
     "sizeByData":"data2",
     "title":`Bubble Heatmap of gene expression in ${organism} ${organ}`,
     "variablesClustered":"true"

    };

    return (
        <CanvasXpressReact 
          target={target} 
          data={data} 
          config={config} 
        />
   )
    }

export default BubbleHeatmap;