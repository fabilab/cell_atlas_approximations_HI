import React from 'react';
import { Table, Tag } from 'antd';
import { CheckCircleTwoTone, StopTwoTone } from '@ant-design/icons';

const TableBox = ({ state }) => {
  const filteredData = state.celltypes .map((celltype, index) => 
    {
      const row = { key: index, celltype };
      let organCount = 0;
      state.organs.forEach((organ, organIndex) => {
        row[organ] = state.detected[index][organIndex];
        if (state.detected[index][organIndex]) {
          organCount++;
        }
      });
      return organCount >= 2 ? row : null;
    })
    .filter(Boolean);

  const columns = [
    {
      title: 'Cell Types',
      dataIndex: 'celltype',
      key: 'celltype',
      render: (text) => (
        <a href={`https://www.google.com/search?q=${text}`} target="_blank">
          {text}
        </a>
      ),
      width: '18%',
    },
    ...state.organs.map((organ) => ({
      title: organ,
      dataIndex: organ,
      render: (value) =>
        value ? (
          <i className="fas fa-check fa-xl" style={{ color: '#45b82e' }}></i>
        ) : (
          <StopTwoTone twoToneColor="#d9d9d9" />
        ),
    })),
  ];

  return (
    <Table
      columns={columns}
      dataSource={filteredData}
      pagination={false}
      scroll={{
        y: '50vh',
      }}
    />
  );
};

export default TableBox;
