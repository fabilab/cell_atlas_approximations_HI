import React from 'react';
import { Space, Table, Tag } from 'antd';
import { CheckCircleTwoTone, StopTwoTone } from '@ant-design/icons';
import { render } from '@testing-library/react';

// Showing cell types and their detection status in different organs.
const TableBox = ({ state }) => {
    // console.log("value is"  + state.detected);
    const columns = [
      {
        title: 'Cell Types',
        dataIndex: 'celltype',
        key: 'celltype',
        render: (text) => <a href={`https://www.google.com/search?q=${text}`} target="_blank">{text}</a>,
        width: '18%',
      },
      ...state.organs.map((organ, index) => ({
        title: organ,
        dataIndex: organ,
        // for each column(organ), check the detected status
        render: (value) => (value ? <i className="fas fa-check fa-xl" style={{ color: '#44bf22' }}></i> : <StopTwoTone twoToneColor="#d9d9d9" />)
      }))
    ];
  
    const data = state.celltypes.map((celltype, index) => {
      const row = { key: index, celltype };
      state.organs.map((organ, organIndex) => {
        row[organ] = state.detected[index][organIndex];
      });
      return row;
    });
  
    return <Table 
            columns={columns} 
            dataSource={data} 
            pagination={{
              pageSize: 50,
            }}
            scroll={{
              y: "70vh",
            }}
          />;
  };
  
  export default TableBox;
  