import React from 'react';
import Plot from 'react-plotly.js';


const OrganCellChart = ({ apiCellOrgan, organName }) => {
    // Find the index of the organ
    const organIndex = apiCellOrgan.organs.indexOf(organName);

    // Filter the celltypes and detected values for non-zero values
    const nonZeroData = apiCellOrgan.celltypes.map((cellType, index) => ({
        name: cellType,
        value: apiCellOrgan.detected[index][organIndex]
    })).filter(item => item.value > 0);

    // Data for Plotly
    const data = [{
        type: 'bar',
        y: nonZeroData.map(item => item.name),
        x: nonZeroData.map(item => item.value),
        orientation: 'h'
    }];

    return (
        <Plot 
            data={data}
            layout={{ title: `Cell types for ${organName}`, margin: { l: 150 } }}
        />
    );
};

export default OrganCellChart;
