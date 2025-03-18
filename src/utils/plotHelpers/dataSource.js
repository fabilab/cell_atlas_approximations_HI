import React from 'react';
import { Popover, Button } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import organismMetadata from '../organismMetadata';

const DataSource = ({ organism, organisms }) => {
  // Determine which prop to use: organism (single) or organisms (array)
  const organismList = organisms || (organism ? [organism] : []);

  if (!organismList.length) {
    return null;
  }

  const getDataSourceContent = () => {
    const content = organismList.map(org => {
      const metadata = organismMetadata[org];
      if (metadata) {
        const { dataSource, paperHyperlink } = metadata;
        if (Array.isArray(dataSource) && Array.isArray(paperHyperlink)) {
          return dataSource.map((source, index) => (
            <p key={`${org}-${index}`} style={{ marginBottom: '10px' }}>
              <strong>{org}:</strong> {source}
              <br />
              <a href={paperHyperlink[index]} target="_blank" rel="noreferrer" style={{ color: '#1890ff' }}>
                View Paper
              </a>
            </p>
          ));
        } else {
          return (
            <p key={org} style={{ marginBottom: '10px' }}>
              <strong>{org}:</strong> {dataSource || "Data source not available"}
              <br />
              <a href={paperHyperlink || "#"} target="_blank" rel="noreferrer" style={{ color: '#1890ff' }}>
                View Paper
              </a>
            </p>
          );
        }
      }
      return (
        <p key={org} style={{ marginBottom: '10px' }}>
          <strong>{org}:</strong> Data source not available
          <br />
          <span>Hyperlink unavailable</span>
        </p>
      );
    });

    return (
      <div style={{ maxWidth: '400px', maxHeight: '500px', overflowY: 'auto', paddingRight: '10px' }}>
        {content}
      </div>
    );
  };

  return (
    <Popover content={getDataSourceContent()} placement="bottom">
        <Button
        type="default"
        icon={<InfoCircleOutlined />}
        style={{
            borderRadius: '4px',
            background: '#f0f0f0',
            borderColor: '#d9d9d9',
        }}
        >
        Data Source
        </Button>
    </Popover>
    );
};

export default DataSource;