import React from 'react';
import Plot from 'react-plotly.js';
import chroma from 'chroma-js';

const HomologsGraph = ({ state }) => {
    let { features, source_organism, target_organism, queries, targets, distances } = state;

    // Ensure all properties are defined
    features = features || '';
    queries = queries || [];
    targets = targets || [];
    distances = distances || [];

    // Convert the features string to an array
    const featureArray = features.split(',');

    // Filter and arrange queries and targets based on featureArray order
    const orderedQueries = [];
    const orderedTargets = [];
    const orderedDistances = [];

    featureArray.forEach(feature => {
        queries.forEach((query, index) => {
            if (query === feature) {
                orderedQueries.push(query);
                orderedTargets.push(targets[index]);
                orderedDistances.push(distances[index]);
            }
        });
    });

    // Create y position mappings to ensure alignment
    const yPositionMap = {};
    let currentY = featureArray.length - 1; // Start from the top

    // Assign y positions based on corresponding target
    orderedQueries.forEach((query, index) => {
        const queryLower = query.toLowerCase();
        const targetLower = orderedTargets[index].toLowerCase();
        if (!(queryLower in yPositionMap)) {
            yPositionMap[queryLower] = currentY;
            currentY--;
        }
        if (!(targetLower in yPositionMap)) {
            yPositionMap[targetLower] = currentY;
            currentY--;
        }
    });


    // Define Plotly data
    const plotData = [
        {
            type: 'scatter',
            mode: 'lines',
            x: [],
            y: [],
            line: {
                width: 2,
                // color: '#ffd666' // Lines color
                color: '#b37feb',
            }
        },
        {
            type: 'scatter',
            mode: 'markers+text',
            x: [],
            y: [],
            text: [],
            textposition: [],
            marker: {
                size: 20,
                // color: '#9254de',
                color: '#73d13d',
            }
        },
        {
            type: 'scatter',
            mode: 'text',
            x: [],
            y: [],
            text: [],
            textposition: 'top center',
            showlegend: false,
            textfont: {
                size: 10,
                color: 'black'
            }
        }
    ];

    // Add nodes and edges to the plotData
    orderedQueries.forEach((query, index) => {
        const target = orderedTargets[index];
        const distance = orderedDistances[index];
        const sourceY = yPositionMap[query.toLowerCase()];
        const targetY = yPositionMap[target.toLowerCase()];

        const midX = 0.5;
        const midY = (sourceY + targetY) / 2;
        
        plotData[0].x.push(0, 1, null);
        plotData[0].y.push(sourceY, targetY, null);

        plotData[1].x.push(0, 1);
        plotData[1].y.push(sourceY, targetY);
        plotData[1].text.push(query, target);
        // Push text position for queries and targets
        plotData[1].textposition.push('middle left', 'middle right');
         // Push colors for queries and targets

        plotData[2].x.push(midX);
        plotData[2].y.push(midY);
        plotData[2].text.push(distance.toFixed(2));
    });

    // Define layout
    const layout = {
        title: `<b>Homologs of genes from ${source_organism} to ${target_organism}`,
        showlegend: false,
        xaxis: {
            showgrid: false,
            zeroline: false,
            showticklabels: false,
            range: [-0.2, 1.2],
        },
        yaxis: {
            showgrid: false,
            zeroline: false,
            showticklabels: false,
        },
        height: targets.length * 50 + 100,
    };

    return (
        <div>
            <Plot
                data={plotData}
                layout={layout}
            />
        </div>
    );
}

export default HomologsGraph;
