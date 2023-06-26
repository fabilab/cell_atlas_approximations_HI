import CanvasXpressReact from 'canvasxpress-react';

// average: data, fraction: data2
const BubbleHeatmap = ({ target, xaxis, yaxis, average, fractions, organism, organ }) => { 

    let data =  {
        "y" : {
          "vars" : xaxis,
          "smps" : yaxis,
          "data" : average,
          "data2": fractions,
        }
      };

    let config = {
      graphType:"Heatmap",
      guides:"true",
      heatmapIndicatorPosition:"top",
      legendKeyBackgroundBorderColor:"rgba(255,255,255,0)",
      legendKeyBackgroundColor:"rgba(255,255,255,0)",
      objectBorderColor:"rgb0,0,0)",
      samplesClustered:"true",
      showSmpDendrogram:"false",
      showVarDendrogram:"false",
      sizeBy:"Size",
      sizeByData:"data2",
      title:`Bubble Heatmap showing gene expression and fractions in ${organism} ${organ}`,
      variablesClustered:"true",
      smpTitle:"Genes",
      varTitle:"Cell types",
      varLabelRotate:"45",
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