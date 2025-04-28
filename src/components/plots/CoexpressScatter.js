import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';
import chroma from 'chroma-js';
import DataSource from '../../utils/plotHelpers/dataSource.js';

const CoexpressScatter = ({ state }) => {
    let { organism, features, expData, unit, hasLog, by } = state;

    // Transform the data (log transform if needed)
    const logTransformOrNone = value => (hasLog ? Math.log10(value + 1) : value);
    const plotReadyExpData = expData.map(item => ({
        ...item,
        average: item.average.map(averageArray =>
            averageArray.map(logTransformOrNone).map(value => value.toPrecision(5))
        ),
    }));

    const finalUnit = hasLog ? `log10(${unit})` : unit;

    // Generate unique colors for each organ using chroma-js
    const organs = plotReadyExpData.map(item => item.organ);
    const colors = chroma.scale('Spectral').mode('lch').colors(organs.length);

    const organColorMap = organs.reduce((acc, organ, index) => {
        acc[organ] = colors[index];
        return acc;
    }, {});

    // Memoize plotData to prevent unnecessary recalculations
    const plotData = useMemo(() => {
        return plotReadyExpData.map(item => ({
            x: item.average[0],
            y: item.average[1],
            mode: 'markers',
            type: 'scatter',
            name: item.organ,
            text: item.average[0].map((_, idx) => {
                const baseText = `${features[0]}: ${item.average[0][idx]}<br>${features[1]}: ${item.average[1][idx]}<br>Organ: ${item.organ}`;
                return by === "celltype" ? `${baseText}<br>Cell type: ${item.celltypes[idx]}` : `${baseText}<br>Cell state: ${idx + 1}`;
            }),
            marker: {
                size: 12,
                color: organColorMap[item.organ],
                symbol: by === "celltype" ? 'circle' : 'square',
            },
            hoverinfo: 'text',
        }));
    }, [plotReadyExpData, features, by, organColorMap]);

    // Memoize layout to prevent unnecessary recalculations
    const layout = useMemo(() => ({
        title: {
            text: `Coexpression of ${features[0]} and ${features[1]} across ${by} and organs in ${organism}`,
        },
        xaxis: {
            title: {
                text: `${features[0]} (${finalUnit})`,
            },
        },
        yaxis: {
            title: {
                text: `${features[1]}<br>(${finalUnit})`,
            },
        },
    }), [features, by, organism, finalUnit]);

    return (
		<div style={{ display: "flex", flexDirection: "column" }}>
			<div>
				<Plot data={plotData} layout={layout} />
			</div>
			<div>
				<DataSource organism={organism} />
			</div>
		</div>
	);
};

export default CoexpressScatter;