import React from 'react';
import { Space, Table, Tag } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

const TableBox = ({ state }) => {
    console.log("value is !!!!!=====" + state.detected);
    const columns = [
      {
        title: 'Cell Type',
        dataIndex: 'celltype',
        key: 'celltype'
      },
      ...state.organs.map((organ, index) => ({
        title: organ,
        dataIndex: organ,
        render: (value) => (value ? <CheckOutlined /> : <CloseOutlined />)
      }))
    ];
  
    const data = state.celltypes.map((celltype, index) => {
      const row = { key: index, celltype };
      state.organs.forEach((organ, organIndex) => {
        row[organ] = state.detected[index][organIndex];
      });
      return row;
    });
  
    return <Table columns={columns} dataSource={data} />;
  };
  
  export default TableBox;
  