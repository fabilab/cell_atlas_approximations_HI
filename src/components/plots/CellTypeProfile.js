import React, { useState, useEffect } from 'react';
import ImageMapper from "react-img-mapper";
import orgMeta from "../../utils/organismMetadata.js";
import { scaleImage } from "../../utils/plotHelpers/scaleImage.js";
import { scaleLinear } from "d3-scale";
import Plot from 'react-plotly.js';

const CellTypeProfile = ({ state }) => {
  const { cellType, description, distributionData } = state;
  console.log(distributionData)
  const [selectedSpecies, setSelectedSpecies] = useState('all');
  const [organTotal, setOrganTotal] = useState(null);
  const [distributionPlotData, setDistributionPlotData] = useState(null);
  const [scalingFactors, setScalingFactors] = useState({ width: 1, height: 1 });

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
    
    const plotData = d.map((speciesData) => ({
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
    
    if (plotData.length === 1) {
      console.log(plotData[0]['y'])
      const minCount = Math.min(...plotData[0]['y']);
      const maxCount = Math.max(...plotData[0]['y']);
      console.log(minCount, maxCount)
      const colorScale = scaleLinear()
        .domain([minCount, maxCount])
        .range(["#f0d2cc", "#ed4e2b"]);
      plotData[0].marker = {
        color: plotData[0].y.map(c => colorScale(c))
      }
    }
    
    setOrganTotal(total);
    setDistributionPlotData(plotData)
  }

  // Render image map component
  const renderImageMap = () => {
    const counts = distributionData.data.filter(d=>d.organism===selectedSpecies)[0].organCounts.reduce((acc, item) => {
      acc[item.organ] = item.count;
      return acc;
    }, {});
    if (Object.keys(counts).length === 1) {
      return <></>
    }
    const minCount = Math.min(...Object.values(counts));
    const maxCount = Math.max(...Object.values(counts));
    const colorScale = scaleLinear()
      .domain([minCount, maxCount])
      .range(["#f0d2cc", "#ed4e2b"]);

    const areas = Object.entries(orgMeta[selectedSpecies]?.organs || {}).map(([organ, metadata]) => {
      const coords = metadata.coords.split(",").map(Number);
      const adjustedCoords = coords.map((coord, index) =>
        index % 2 === 0 ? coord * scalingFactors.width : coord * scalingFactors.height
      );
  
      const isLabel = organ.includes("-label");
      const organColor = counts[organ] ? colorScale(counts[organ]) : "transparent";
      return {
        id: organ,
        name: organ,
        shape: metadata.shape || "poly",
        coords: adjustedCoords,
        fillColor: isLabel ? "transparent" : organColor,
        preFillColor: isLabel ? "transparent" : organColor,
        strokeColor: "transparent",
      };
    });

    let imagePathPrefix = `grey_${selectedSpecies}`;

    return (
      // eslint-disable-next-line
      <ImageMapper
        src={require(`../../asset/anatomy/${imagePathPrefix}.jpg`)}
        map={{ name: `${selectedSpecies}-map`, areas: areas }}
        // onMouseEnter={handleMouseEnter}
        width={450}
        height={450}
      />
    );
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
        if (orgMeta[selectedSpecies].organs) {
          const imagePathPrefix = `grey_${selectedSpecies}`;
          let imageWithDimensions = require(`../../asset/anatomy/${imagePathPrefix}.jpg`);
          scaleImage(imageWithDimensions, 450, setScalingFactors)
        }
      }
    }
  }, [selectedSpecies])

  const layout = {
    width: 1000,
    height: 450,
    barmode: 'stack',
    showlegend: distributionPlotData ? distributionPlotData.length > 1 : false,
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
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          {
            selectedSpecies !== 'all' &&
            renderImageMap()
          }
      </div>
    </div>
  );
};

export default CellTypeProfile;