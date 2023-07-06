import CanvasXpressReact from 'canvasxpress-react';

const Heatmap = ({ target, xaxis, yaxis, values, organism, organ }) => { 
  
  
  let data =  {
      "y" : {
        "vars" : xaxis,
        // "smps" : yaxis.map((gene,index) => (
        //   `<a key=${index} href='https://www.genecards.org/cgi-bin/carddisp.pl?gene=${gene}'>${gene}</a>`
        // )),
        "smps": yaxis,
        "data" : values
      }
    };

  let config = {
    graphOrientation: "vertical",
    graphType: "Heatmap",
    theme: "CanvasXpress",
    title: `Heatmap of gene expression in ${organism} ${organ}`,
    smpTitle:"Genes",
    varTitle:"Cell types",
    percentAspectRatioPlotArea: 0.5,
    heatmapAutoAdjust: true,
    heatmapIndicatorHeight: 25,
    // "varLabelRotate":"45",
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