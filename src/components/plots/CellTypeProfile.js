import React from 'react';
import Plot from 'react-plotly.js';

const CellTypeProfile = ({ state }) => {
  const { cellType, description, distributionData } = state;

  // Process and sort data
  const organTotals = {};
  distributionData.data.forEach(species => {
    species.organCounts.forEach(({ organ, count }) => {
      organTotals[organ] = (organTotals[organ] || 0) + count;
    });
  });

  const sortedOrgans = Object.entries(organTotals)
    .sort(([, a], [, b]) => b - a)
    .map(([organ]) => organ);

  // Create plot data for vertical bars
  const plotData = distributionData.data.map((speciesData) => ({
    x: sortedOrgans,
    y: sortedOrgans.map(organ => {
      const organCount = speciesData.organCounts.find(count => count.organ === organ);
      return organCount ? organCount.count : 0;
    }),
    name: speciesData.organism,
    type: 'bar',
    text: sortedOrgans.map(organ => {
      const organCount = speciesData.organCounts.find(count => count.organ === organ);
      return organCount ? organCount.count.toString() : '';
    }),
    textposition: 'auto',
  }));

  const layout = {
    width: 1000,
    height: 450,
    barmode: 'stack',
    showlegend: true,
    margin: {
      l: 50,
      r: 50,
      t: 50,
      b: 100
    },
    xaxis: {
      title: 'Tissue',
      tickangle: 45,
      automargin: true
    },
    yaxis: {
      title: 'Cell Count',
      range: [0, Math.max(...Object.values(organTotals))], // Add 10% padding
    },
    plot_bgcolor: 'white',
    paper_bgcolor: 'white',
    font: {
      family: 'Arial, sans-serif',
      size: 12
    },
    legend: {
      x: 1,
      y: 1,
      xanchor: 'right',
      yanchor: 'top'
    }
  }
  
  const config = {
    responsive: true,
    displayModeBar: false
  }
  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ 
        fontSize: '24px', 
        marginBottom: '8px',
        fontWeight: 'bold'
      }}>
        {cellType}
      </h1>
      <p style={{ 
        fontSize: '14px',
        marginBottom: '24px',
        lineHeight: '1.5'
      }}>
        {description}
      </p>
      <h1 style={{ 
        fontSize: '24px', 
        marginBottom: '8px',
        fontWeight: 'bold'
      }}>
        Cell type distribution
      </h1>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Plot
          data={plotData}
          layout={layout}
          config={config}
          style={{
            width: '900px',
            height: '450px'
          }}
        />
      </div>
    </div>
  );
};

export default CellTypeProfile;