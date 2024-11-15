import React from 'react';
import { Typography } from 'antd';
import Plot from 'react-plotly.js';

const { Title, Paragraph } = Typography;

const CellTypeProfile = ({ state }) => {
  const { cellType, description, distributionData } = state;

  // Extracting data for the bar chart from distributionData
  const plotData = distributionData.data.map((entry) => ({
    x: entry.organCounts.map((oc) => oc.organ),
    y: entry.organCounts.map((oc) => oc.count),
    name: entry.organism,
    type: 'bar'
  }));

  return (
    <div style={{ width: '100%', margin: '20px auto', padding: '20px' }}>
      <Title level={2}>{cellType}</Title>
      <Paragraph>{description}</Paragraph>

      <Plot
        data={plotData}
        layout={{
          title: `Distribution of ${cellType} across species`,
          xaxis: { title: 'Tissue' },
          yaxis: { title: 'Cell Count' },
          barmode: 'stack'
        }}
        style={{ width: '100%', height: '500px' }}
      />
    </div>
  );
};

export default CellTypeProfile;
