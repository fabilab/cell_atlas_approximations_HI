import React, { useEffect, useRef } from 'react';
import Plot from 'react-plotly.js';

const CoexpressScatter = ({ state }) => {
    const plotRef = useRef(null);

    let { plotType, organism, featureX, featureY, expData, unit } = state;

    const plotData = expData.map(item => ({
        x: item.average[0],
        y: item.average[1],
        celltype: item.celltypes,
        mode: 'markers',
        type: 'scatter',
        name: item.organ,
        text: item.celltypes.map((cellType, index) => 
        `${featureX}: ${item.average[0][index]}<br>${featureY}: ${item.average[1][index]}<br>Organ: ${item.organ}<br>Cell type: ${cellType}`
        ),
        marker: { size: 12 },
        hoverinfo: 'text',
        colorbar: {
            title: {
              text: "unit",
            },
            len: 1.2,
        },
    }));

    var layout = {
        title: `Co-expression of ${featureX} and ${featureY} across cell types and organs in ${organism}`,
        xaxis: {
            title: featureX + ` (${unit})`,
            autorange: true
        },
        yaxis: {
            title: featureY,
            autorange: true
        }
      };


  return (
    <div>
        <Plot
            data={plotData}
            layout={layout}
        />
    </div>
    
  );
};

export default CoexpressScatter;
