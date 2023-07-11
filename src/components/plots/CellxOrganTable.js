import React from 'react';
import { Table, Tag } from 'antd';
import { StopTwoTone } from '@ant-design/icons';

const CellxOrganTable = ({ state }) => {
  //  cell types that found in >= different organs
  const multiOrgansData = state.celltypes.map((celltype, index) => 
  {
    const row = { key: index, celltype };
    let organCount = 0;
    state.organs.forEach((organ, organIndex) => {
      row[organ] = state.detected[index][organIndex];
      if (state.detected[index][organIndex]) {
        organCount++;
      }
    });
    return organCount > 1 ? row : null;
  }).filter(Boolean);
  
  //  cell types that found in only ONE organ
  const uniqueOrganData = state.celltypes.map((celltype, index) =>
  {
    const row = { key: index, celltype };
    let organCount = 0;
    state.organs.forEach((organ, organIndex) => {
      row[organ] = state.detected[index][organIndex];
      if (state.detected[index][organIndex]) {
        organCount++;
      }
    });
    return organCount < 2 ? row : null;
  }).filter(Boolean);

  console.log(uniqueOrganData);
  
  // console.log("cell types that found in unique organ\n");
  // console.log(uniqueOrganData);

  let finalRow = {
    key: multiOrgansData.length + 1,
    celltype: 'Cell types in Unique Organ'
  }

  state.organs.forEach((organ, organIndex) => {
    uniqueOrganData.forEach((celltype, celltypeIndex) => {
      if (celltype[organ]) {
        if (finalRow[organ]) {
          finalRow[organ] = finalRow[organ] + `\n ${celltype.celltype}`;
        } else {
          finalRow[organ] = celltype.celltype;
        }
      }
    })
  });
  
  console.log("Final row is\n")
  console.log(finalRow);
  console.log("Multi organ data is\n")
  console.log(multiOrgansData)
  const columnsMulti = [
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
          typeof(value) === 'string' ? 
            value 
          : 
            <i className="fas fa-check fa-xl" style={{ color: '#45b82e' }}></i>
        ) : (
          <StopTwoTone twoToneColor="#d9d9d9" />
        ),
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
    <section>
      <Table
        columns={columnsMulti}
        dataSource={multiOrgansData}
        pagination={false}
        scroll={{
          y: '45vh',
        }}
      />
      <Table
        columns={columnsUnique}
        dataSource={[finalRow]} // Wrap the final row in an array to display it as a single row
        pagination={false}
      />
  </section>
  );
};

export default CellxOrganTable;
