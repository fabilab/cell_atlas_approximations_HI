import React from 'react';
import { Table } from 'antd';
import { StopTwoTone } from '@ant-design/icons';
import { Popover, Button } from 'antd';

// FIXME: why is this function the only one that takes the entire state in like this??
const OrganxOrganismTable = ({ state }) => {
  
    let { organs, organisms, detected } = state;
    let dataSource = "Tabula Sapiens,Tabula Muris Senis,Tabula Microcebus,Wagner et al. 2018, Liao et al 2022";
    let paperHyperlink = "https://atlasapprox.readthedocs.io/en/latest/index.html";
    // Filter cell types detected in multiple organs
    // Define the columns for the table
    const columns = [
        {
            title: 'Organs / Organisms',
            dataIndex: 'organ',
            key: 'organ',
        },
        ...organisms.map(organism => ({
            title: organism,
            dataIndex: organism,
            key: organism,
            fixed: 'top',
            render: (value) => {
                if (value === 0) {
                    return <StopTwoTone twoToneColor="#d9d9d9" />;
                }
                if (typeof (value) === 'string') {
                    return value;
                }
                return <i className="fas fa-check fa-xl" style={{ color: '#45b82e' }}></i>;
            }
        }))
    ];

    // Prepare the dataSource for the table
    const data = organs.map((organ, organIndex) => {
        const dataRow = { key: organIndex, organ: organ };
        organisms.forEach((organism, orgIndex) => {
            dataRow[organism] = detected[organIndex][orgIndex];
        });
        return dataRow;
    });

    return (
        <div style={{ display: "flex", flexDirection: "column", margin: "1vh" }}>
        <div>
          <Popover content={dataSource} placement='right'>
            <Button href={paperHyperlink} target="_blank">Data source</Button>
          </Popover>
        </div>
        <br></br>
        <div>
            <Table 
                dataSource={data} 
                columns={columns} 
                pagination={false}
                className="sticky-header-table"
            />
        </div>
      </div>
    );
};

export default OrganxOrganismTable;
