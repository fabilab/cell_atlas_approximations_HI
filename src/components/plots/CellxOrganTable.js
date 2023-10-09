import React from 'react';
import { Table } from 'antd';
import { StopTwoTone } from '@ant-design/icons';

const CellxOrganTable = ({ state }) => {
  
    // Filter cell types detected in multiple organs
    const multiOrgansData = state.celltypes.map((celltype, index) => {
      const row = { key: index, celltype };
      let organCount = 0;
      state.organs.forEach((organ, organIndex) => {
        row[organ] = state.detected[index][organIndex] > 0;
        if (state.detected[index][organIndex]) {
            organCount++;
        }
      });
      return organCount > 1 ? row : null;
    }).filter(Boolean);

    // Construct a dictionary for cell types uniquely detected in each organ
    const uniqueOrganDict = {};
    state.organs.forEach((organ) => {
      uniqueOrganDict[organ] = [];
    });

    state.celltypes.forEach((celltype, index) => {
      let detectedCount = 0;
      let detectedOrgan = null;
      state.organs.forEach((organ, organIndex) => {
        if (state.detected[index][organIndex] > 0) {
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
    state.organs.forEach((organ) => {
      uniqueRow[organ] = uniqueOrganDict[organ].join(', ');
    });
    multiOrgansData.push(uniqueRow);

    // Define the table columns
    const columns = [
      {
        title: 'Cell Types',
        dataIndex: 'celltype',
        key: 'celltype',
        render: (text) => (
          <a href={`https://www.google.com/search?q=${text}`} target="_blank" style={{fontWeight:"bold"}}>
            {text}
          </a>
        ),
        fixed: 'left',
      },
      ...state.organs.map(organ => ({
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
      <section style={{ margin: '2vh', justifyContent: 'center', alignItems: 'center'}}>
        <Table
          columns={columns}
          dataSource={multiOrgansData}
          pagination={false}
          className="sticky-header-table"
        />
      </section>
    );
};

export default CellxOrganTable;
