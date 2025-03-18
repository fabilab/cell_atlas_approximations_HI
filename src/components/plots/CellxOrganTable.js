import React from 'react';
import { Table } from 'antd';
import { StopTwoTone } from '@ant-design/icons';
import DataSource from '../../utils/plotHelpers/dataSource.js';

const CellxOrganTable = ({ state }) => {
    let { celltypes, detected, organism, organs } = state;

    // Filter cell types detected in multiple organs
    const multiOrgansData = celltypes.map((celltype, index) => {
      const row = { key: index, celltype };
      let organCount = 0;
      organs.forEach((organ, organIndex) => {
        row[organ] = detected[index][organIndex] > 0;
        if (detected[index][organIndex]) {
            organCount++;
        }
      });
      return organCount > 1 ? row : null;
    }).filter(Boolean);

    // Construct a dictionary for cell types uniquely detected in each organ
    const uniqueOrganDict = {};
    organs.forEach((organ) => {
      uniqueOrganDict[organ] = [];
    });

    celltypes.forEach((celltype, index) => {
      let detectedCount = 0;
      let detectedOrgan = null;
      organs.forEach((organ, organIndex) => {
        if (detected[index][organIndex] > 0) {
          detectedCount++;
          detectedOrgan = organ;
        }
      });
      if (detectedCount === 1) {
        uniqueOrganDict[detectedOrgan].push(celltype);
      }
    });

    // Add a row for uniquely detected cell types at the bottom
    const uniqueRow = { key: 'unique', celltype: 'Unique Cell Types' };
    organs.forEach((organ) => {
      uniqueRow[organ] = uniqueOrganDict[organ].join(', ');
    });
    multiOrgansData.push(uniqueRow);

    // Define the table columns
    const columns = [
      {
        title: 'Cell Types / Organs',
        dataIndex: 'celltype',
        key: 'celltype',
        render: (text) => (
          <a href={`https://www.google.com/search?q=${text}`} target="_blank" rel="noreferrer" style={{fontWeight:"bold"}}>
            {text}
          </a>
        ),
        fixed: 'left',
      },
      ...organs.map(organ => ({
        title: organ,
        dataIndex: organ,
        key: organ,
        fixed: 'top',
        render: (value) => {
          if (!value) {
              return <StopTwoTone twoToneColor="#d9d9d9" />;
          }
          if (typeof (value) === 'string') {
              return value;
          }
          return <i className="fas fa-check fa-xl" style={{ color: '#45b82e' }}></i>;
        }
      }))
    ];

    return (
      <div style={{ display: "flex", flexDirection: "column", margin: "1vh" }}>
        <div>
          <DataSource organism={organism} />
        </div>
        <br></br>
        <div>
          <Table
            columns={columns}
            dataSource={multiOrgansData}
            pagination={false}
            className="sticky-header-table"
          />
        </div>
      </div>
    );
};

export default CellxOrganTable;
