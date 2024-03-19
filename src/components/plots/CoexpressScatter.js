import React from 'react';
import Plot from 'react-plotly.js';
import { Popover, Button } from 'antd';
import chroma from 'chroma-js';
import orgMeta from '../../utils/organismMetadata.js';

const CoexpressScatter = ({ state }) => {

    let { plotType, organism, featureX, featureY, expData, unit, hasLog } = state;
    let dataSource = orgMeta[organism]?.dataSource || "Data source not available";
    let paperHyperlink = orgMeta[organism]?.paperHyperlink || "Hyperlink unavailable";

    const logTransform = value => Math.log10(value + 1);
    if (hasLog) {
        expData.forEach(data => {
            data.average = data.average.map(averageArray => averageArray.map(logTransform));
        });
        unit = `log10(${unit})`;
    }

    // Generate unique colors for each organ using chroma-js
    const organs = expData.map(item => item.organ);
    const colors = chroma.scale('Spectral').mode('lch').colors(organs.length);

    const organColorMap = organs.reduce((acc, organ, index) => {
        acc[organ] = colors[index];
        return acc;
    }, {});

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
        marker: { 
            size: 12,
            color: organColorMap[item.organ],
        },
        hoverinfo: 'text',
    }));

    var layout = {
        title: `Co-expression of ${featureX} and ${featureY} across cell types and organs in ${organism}`,
        xaxis: {
            title: featureX + ` (${unit})`,
            autorange: true,
        },
        yaxis: {
            title: featureY,
            autorange: true
        }
      };


  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
        <div>
            <Plot
                data={plotData}
                layout={layout}
            />
        </div>
        <div>
          <Popover content={dataSource} placement='right'>
            <Button href={paperHyperlink} target="_blank">Data source</Button>
          </Popover>
        </div>
    </div>
  );
};

export default CoexpressScatter;
