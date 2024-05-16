import React from 'react';
import Plot from 'react-plotly.js';

const HomologsGraph = ({ state }) => {
    let { features, source_organism, target_organism, queries, targets, distances } = state;

    // Convert the features string to an array
    const featureArray = features.split(',');

    // Filter and arrange queries and targets based on featureArray order
    const orderedQueries = [];
    const orderedTargets = [];
    const orderedDistances = [];

    featureArray.forEach(feature => {
        const featureGroup = [];
        queries.forEach((query, index) => {
            if (query === feature) {
                featureGroup.push({ query, target: targets[index], distance: distances[index] });
            }
        });

        // Sort the group by distance in increasing order
        featureGroup.sort((a, b) => a.distance - b.distance);

        // Add sorted group to ordered arrays
        featureGroup.forEach(item => {
            orderedQueries.push(item.query);
            orderedTargets.push(item.target);
            orderedDistances.push(item.distance);
        });
    });

    // Create y position mappings to ensure alignment
    const yPositionMap = {};
    let currentY = featureArray.length - 1; // Start from the top

    // Assign y positions based on corresponding target
    console.log(orderedQueries);
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
            mode: 'markers+text',
            x: [],
            y: [],
            text: [],
            textfont: {
                weight: 'bold',
            },
            textposition: [],
            marker: {
                size: 20,
                color: '#1890ff',
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

        // show distance between nodes
        const midX = 0.5;
        const midY = (sourceY + targetY) / 2;
  
        // Create a new line trace for each connection
        plotData.push({
            type: 'scatter',
            mode: 'lines',
            x: [0, 1, null],
            y: [sourceY, targetY, null],
            line: {
                width: 1,
                color: '#434343',
            }
        });

        // null is used here to ensure that the line will only connect queried gene and it's target
        plotData[0].x.push(0, 1);
        plotData[0].y.push(sourceY, targetY);
        plotData[0].text.push(query, target);
        plotData[0].textposition.push('middle left', 'middle right');

        plotData[1].x.push(midX);
        plotData[1].y.push(midY);
        plotData[1].text.push(distance.toFixed(2));

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