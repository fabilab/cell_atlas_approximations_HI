import React from 'react';
import { Input, Typography, Row, Col } from 'antd';
import { RobotOutlined, SendOutlined } from '@ant-design/icons';
import search from '../asset/search.png';
const { Title } = Typography;
const { Text } = Typography;
const style = {
  background: '#0092ff',
  padding: '8px 0',
};

const Landing = ({ currentMessage, setCurrentMessage }) => {

  const sampleQueries = [
    'What species are available?',
    'Explore zebrafish',
    'What kind of data is available?',
    'Where are fibroblast detected in mouse?',
    'Show organ for mouse in chromatin accessibility.',
    'Show the marker genes for coronary in human heart.',
    'What cell types are present in each organ of mouse?',
    'What cell type is the highest expressor of TP53 in human?',
    'Compare expression of CD19 in fibroblast across organs in mouse',
    'What is the fraction of TP53,METTL14,APOE,CD8A,CD19 in human lung?',
    'What is the average expression of TP53,AHR,MED4,LANCL2 in human lung?',
    'What is the chromatin accessibility of chr1:9955-10355 in human lung?'
  ];

  return (
    <div className="landing-page">
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginTop: "24vh", 
      }}>
        <img src={search} alt="search icon" style={{ marginRight: '10px' }} />
        <Title level={2} style={{ 
          margin: 0,  // This is added to remove the default margin of the title
          fontFamily: 'Arial, sans-serif',
          color: '#303131',
          lineHeight: '1.6',
        }}>
          Explore Cell Atlas Approximations
        </Title>
      </div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginTop: '9vh' 
      }}>
        <Input
          placeholder="Ask me a question OR click on the Xmas tree below..."
          prefix={<RobotOutlined style={{ paddingRight: '10px' }}/> }
          suffix={<SendOutlined />}
          style={{
            maxWidth: '50vw', 
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',  // Shadow effect
            height: '50px',  // Increased height
            borderRadius: '25px',
            color:'#1677ff',
            fontWeight: 'bold'
          }}
        />
      </div>
      <div style={{ 
          marginTop: '5vh', 
          // fontWeight: 'bold', 
          color: '#303131', 
          marginLeft:'15%',
          marginRight: '15%',
        }}>
        <Row gutter={{
          xs: 8,
          sm: 16,
          md: 24,
          lg: 32,
        }}>
        {sampleQueries.map((query, index) => (
          <Col span={12} key={index}>
            <div style={{
              marginBottom: '2vh',
              textAlign: index % 2 === 1 ? "left" : "right",
              }}> {/* This div will help space out each Text component */}
              <Text
                onClick={() => setCurrentMessage(query)}
                style={{

                  color: currentMessage === query ? '#fa8c16' : 'initial',
                  cursor: 'pointer',
                  ':hover': { color: 'lightblue' }
                }}
                >{query}
              </Text>
            </div>
          </Col>
        ))}
        </Row>
      </div>

      
      {/* <div style={{ textAlign: 'center', margin: '5vh'}}>
        <Title level={4} style={{ marginBottom: "2vh", color: "#1890ff" }}>Example questions:</Title>
        <div style={{maxHeight:"25vh", overflowY:"scroll"}}>
          {sampleQueries.map((s, index) => (
            <p
              key={index}
              onClick={() => setCurrentMessage(s)}
              style={{
                margin: "1.5vh",
                color: currentMessage === s ? '#fa8c16' : 'initial',
                cursor: 'pointer',
                ':hover': { color: 'lightblue' }
              }}
            >
              {s}
            </p>
          ))}
        </div>
        <br/>
        <p style={{color:"#1890ff"}}>scroll to view more</p>
      </div> */}
    </div>
  );
};

export default Landing;
