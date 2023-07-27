import React from 'react';
import { Table, Tag, Typography } from 'antd';
import { StopTwoTone } from '@ant-design/icons';

const CellxOrganTable = ({ state }) => {

  //  cell types found in >= 2 organs
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

  //  cell types found in only 1 organs
  const uniqueOrganData = state.celltypes.map((celltype, index) => {
    const row = { key: index, celltype };
    let organCount = 0;
    state.organs.forEach((organ, organIndex) => {
      row[organ] = state.detected[index][organIndex] > 0;
      if (state.detected[index][organIndex]) {
        organCount++;
      }
    });
    return organCount < 2 ? row : null;
  }).filter(Boolean);

  let finalRow = {
    key: multiOrgansData.length + 1,
    celltype: 'Cell types in Unique Organ'
  };

  state.organs.forEach((organ, organIndex) => {
    uniqueOrganData.forEach((celltype, celltypeIndex) => {
      if (celltype[organ]) {
        if (finalRow[organ]) {
          finalRow[organ] = finalRow[organ] + `\n ${celltype.celltype}`;
        } else {
          finalRow[organ] = celltype.celltype;
        }
      }
    });
  });

  const columnsMulti = [
    {
      title: 'Cell Types',
      dataIndex: 'celltype',
      key: 'celltype',
      render: (text) => (
        <a href={`https://www.google.com/search?q=${text}`} target="_blank" style={{fontWeight:"bold"}}>
          {text}
        </a>
      ),
      width: 150,
      fixed: 'left',
    },
    ...state.organs.map((organ) => ({
      title: organ,
      dataIndex: organ,
      render: (value) =>
        value ? (
          typeof (value) === 'string' ? 
            value 
          : 
            <i className="fas fa-check fa-xl" style={{ color: '#45b82e' }}></i>
        ) : (
          <StopTwoTone twoToneColor="#d9d9d9" />
        ),
      width: 120,
    })),
  ];

  const columnsUnique = [
    {
      dataIndex: 'celltype',
      key: 'celltype',
      width: '18%',
    },
    ...state.organs.map((organ) => ({
      dataIndex: organ,
      render: (name) => `${name}`,
    })),
  ];

  return (
    <section style={{ margin: '2vh', justifyContent: 'center', alignItems: 'center'}}>
      <Table
        columns={columnsMulti}
        dataSource={multiOrgansData}
        pagination={false}
        scroll={{
          y: '50vh',
        }}
      />
      <Table
        columns={columnsUnique}
        dataSource={[finalRow]}
        pagination={false}
      />
    </section>
  );
};

export default CellxOrganTable;
