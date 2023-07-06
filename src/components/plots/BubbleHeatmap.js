import React from 'react';
import CanvasXpressReact from 'canvasxpress-react';

const BubbleHeatmap = ({ target, xaxis, yaxis, average, fractions, organism, organ }) => {

  let data = {
    y: {
      vars: xaxis,
      smps: yaxis,
      data: average,
      data2: fractions,
    },
  };

  let config = {
    // graphType: 'Heatmap',
    // guides: 'true',
    // "dendrogramHeight": 50,
    // heatmapIndicatorPosition: 'top',
    // legendKeyBackgroundBorderColor: 'rgba(255,255,255,0)',
    // legendKeyBackgroundColor: 'rgba(255,255,255,0)',
    // objectBorderColor: 'rgb0,0,0)',
    // samplesClustered: 'true',
    // showSmpDendrogram: 'false',
    // showVarDendrogram: 'false',
    // sizeBy: 'Size',
    // sizeByData: 'data2',
    // title: `Bubble Heatmap showing gene expression and fractions in ${organism} ${organ}`,
    // variablesClustered: 'true',
    // smpTitle: 'Genes',
    // varTitle: 'Cell types',
    // "xAxis": xaxis,
    // varLabelRotate: '45',
    "clusterAxis": "variables",
   "dendrogramHeight": 50,
   "graphType": "Heatmap",
   "heatmapIndicatorPosition": "top",
   "samplesClustered": true,
   "showSmpDendrogram": false,
   "showVarDendrogram": false,
   "sizeBy": "Size",
   "sizeByData": "data2",
   "smpDendrogramNewick": "(((7,(3,5):4.9):5.7,(1,9):6.8):7.2,(4,((2,8):4.9,(0,6):5.0):6.4):8.0):20.9",
   "theme": "blackAndWhite",
   "title": "Bubble Heatmap Plot",
   "varDendrogramNewick": "(((16,18):2.5,(19,(17,(14,15):1.9):3.8):5.0):6.5,((((0,4):3.2,((5,8):3.1,(1,(2,7):2.2):3.4):4.0):5.1,(3,(6,9):4.7):5.2):5.8,(10,(11,(12,13):4.2):4.6):6.1):10.9):17.9",
   "variablesClustered": true,
   "xAxis": ["Var1","Var2","Var3","Var4","Var5","Var6","Var7","Var8","Var9","Var10","Var11","Var12","Var13","Var14","Var15","Var16","Var17","Var18","Var19","Var20"]
  };

  return (
    <CanvasXpressReact
      target={target}
      data={data}
      config={config}
    />
  );
};

export default BubbleHeatmap;
