import React, { useState, useEffect } from 'react';
import { use } from 'react';
import Plot from 'react-plotly.js';

const CellTypeProfile = ({ state }) => {
  const { cellType, description, distributionData } = state;
  const [selectedSpecies, setSelectedSpecies] = useState('all');
  const [organTotal, setOrganTotal] = useState(null);
  const [distributionPlotData, setDistributionPlotData] = useState(null);

  const makePlot = (d) => {
    const total = {};
      d.forEach(species => {
        species.organCounts.forEach(({ organ, count }) => {
          total[organ] = (total[organ] || 0) + count;
        });
      });

      const sortedOrgans = Object.entries(total)
        .sort(([, a], [, b]) => b - a)
        .map(([organ]) => organ);
      
      const allPlotData = d.map((speciesData) => ({
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
      setOrganTotal(total);
      setDistributionPlotData(allPlotData)
  }

  useEffect(() => {
    if (!distributionPlotData) {
      makePlot(distributionData.data)
    }
  }, [])

  useEffect(() => {
    if (distributionPlotData) {
      if (selectedSpecies === 'all') {
        makePlot(distributionData.data)
      } else {
        makePlot(distributionData.data.filter(d => d.organism === selectedSpecies))
      }
    }
  }, [selectedSpecies])

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
      range: [0, Math.max(...Object.values(organTotal || 0))], // Add 10% padding
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
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '8px' /* Optional for spacing between text and dropdown */
      }}>
        Cell type distribution in
        <select 
          id="species" 
          style={{
            fontSize: '18px', 
            height: 'calc(1em + 16px)', /* Approximate height adjustment */
            lineHeight: '1',
            padding: '4px 8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            value: {selectedSpecies}
          }}
          onChange={e => setSelectedSpecies(e.target.value)}
        >
          <option value="all">All</option>
          {
            distributionData.data.map(d => <option value={d.organism}>{d.organism}</option>)
          }
        </select>
      </h1>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Plot
          data={distributionPlotData}
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