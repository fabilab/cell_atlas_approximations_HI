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
    // a dictionary to keep track of the homologs counts for each queried gene.
    const featureTargetCount = {};

    featureArray.forEach(feature => {
        let displayTargetCounts = 0;
        let totalTargetCounts = 0;
        const featureGroup = [];
        for (let index = 0; index < queries.length; index++) {
            const query = queries[index];
            if (query === feature) {
                // restrict the display homologs number to 5
                if (displayTargetCounts <= 4) {
                    featureGroup.push({ query, target: targets[index], distance: distances[index] });
                    displayTargetCounts += 1;
                }  
                totalTargetCounts += 1;
            }
            featureTargetCount[feature] = totalTargetCounts;
        }

        // Sort the group by distance in increasing order
        featureGroup.sort((a, b) => a.distance - b.distance);

        if (totalTargetCounts > 5) {
            featureGroup.push({ query: feature, target: `... ${totalTargetCounts-5} more`, distance: 0 });
        }


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
    orderedQueries.forEach((query, index) => {
        
        const queryLower = query.toLowerCase();
        const targetLower = orderedTargets[index].toLowerCase();
        if (!(queryLower in yPositionMap)) {
            yPositionMap[queryLower] = currentY;
        }
        if (!(targetLower in yPositionMap)) {
            yPositionMap[targetLower] = currentY;
        }
        // decrease Y coord for every round
        currentY--;
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
        height: orderedTargets.length * 50 + 100
    };

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
        },
        {
            type: 'scatter',
            mode: 'text',
            x: [],
            y: [],
            text: [],
            textposition: 'center',
            showlegend: false,
            textfont: {
                size: 12,
                color: 'black',
                // weight: 'bold',
            }
        }
    ];

    // Line width counter for each query
    const queryLineWidthCounter = {};
    // Add nodes and edges to the plotData
    orderedQueries.forEach((query, index) => {
        const target = orderedTargets[index];
        const distance = orderedDistances[index];
        const sourceY = yPositionMap[query.toLowerCase()];
        const targetY = yPositionMap[target.toLowerCase()];

        // Initialize or increment the line width counter for the current query
        if (!(query in queryLineWidthCounter)) {
            queryLineWidthCounter[query] = 0;
        }
        queryLineWidthCounter[query]++;

        // Calculate line width
        const lineWidth = 1 + 0.5 * (queryLineWidthCounter[query] - 1);

        // show distance between nodes
        const midX = 0.5;
        const midY = (sourceY + targetY) / 2;

        // when distance it valid, draw the line and dots
        if (distance > 0) {
            plotData.push({
                type: 'scatter',
                mode: 'lines',
                x: [0.025, 0.975, null],
                y: [sourceY, targetY, null],
                line: {
                    width: lineWidth,
                    color: '#434343',
                }
            });
            plotData[1].x.push(midX);
            plotData[1].y.push(midY);
            plotData[1].text.push(distance.toFixed(2));

            // null is used here to ensure that the line will only connect queried gene and it's target
            plotData[0].x.push(0, 1);
            plotData[0].y.push(sourceY, targetY);
            plotData[0].text.push(query, target);
            plotData[0].textposition.push('middle left', 'middle right');
        } else {
            plotData[2].x.push(1);
            plotData[2].y.push(targetY);
            plotData[2].text.push(target);
        }

    });

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
