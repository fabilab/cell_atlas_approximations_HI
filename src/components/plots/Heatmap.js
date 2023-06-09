import CanvasXpressReact from 'canvasxpress-react';

const Heatmap = ({ target, xaxis, yaxis, values, organism, organ }) => { 

  const handleClick = (gene) => {
    const url = `https://www.genecards.org/cgi-bin/carddisp.pl?gene=${gene}`;
    window.open(url, "_blank");
  };
  
  let data =  {
    y: {
      vars: xaxis,
      // smps: yaxis.map((gene) => ({
      //   v: gene,
      //   f: `<a href="https://www.genecards.org/cgi-bin/carddisp.pl?gene=${gene}" target="_blank">${gene}</a>`,
      //   click: () => handleClick(gene)
      // })),
      smps: yaxis,
      data: values
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
    // disableCustomizer: true,
    // disableDataFilters: true,
    // disableDataTable: true,
    // disableDrag: true,
    // disableBeacon: true,
    // disableEvents: true,
    toolbarItems:["Save","Table"],
    resizable: false,
    movable:false,
    
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