import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Input, Typography, Row, Col } from 'antd';
import { RobotOutlined, SendOutlined } from '@ant-design/icons';
import search from '../asset/search.png';
const { Title } = Typography;
const { Text } = Typography;


const Landing = ({ }) => {

  const [searchMessage, setSearchMessage] = useState('')
  const history = useHistory();
  const sendFirstSearch = (query) => {
    history.push({pathname:'/mainboard', state: query })
  }

  const sampleQueries = [
    'What species are available?',
    'Explore zebrafish.',
    'What kind of data is available?',
    'Where are fibroblast detected in mouse?',
    'Show organ for mouse in chromatin accessibility.',
    'Show 10 marker genes for coronary in human heart.',
    'What cell types are present in each organ of mouse?',
    'What cell type is the highest expressor of TP53 in human?',
    'Compare expression of CD19 in fibroblast across organs in mouse.',
    'What is the fraction of TP53,METTL14,APOE,CD8A,CD19 in human lung?',
    'What is the average expression of TP53,AHR,MED4,LANCL2 in human lung?',
    'What is the chromatin accessibility of chr1:9955-10355 in human lung?'
  ];

  return (
    <div className="landing-page" style={{
      background: 'linear-gradient(to bottom right, #d3edf9 10%, #ffffff, #ffffff 70%, #fffad6 100%)',
      height: '100vh'
      // background: 'linear-gradient(to right, #b0e57c, #ffffff, #80d8ff)'
      }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        paddingTop: "24vh", 
      }}>
        <img src={search} alt="search icon" style={{ marginRight: '10px', height:'70px' }} />
        <Title level={2} style={{ 
          margin: 0, 
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
        marginTop: '8vh' 
      }}>
        <Input
          placeholder="Ask me a question OR click on the Xmas tree below..."
          value={searchMessage}
          onChange={(e) => setSearchMessage(e.target.value.replace(/(\r\n|\n|\r)/gm, ""))}
          prefix={<RobotOutlined style={{ paddingRight: '10px', color: searchMessage.length > 0 ? '#1677ff' : 'grey' }}/> }
          suffix={<SendOutlined style={{paddingLeft: '10px', color: searchMessage.length > 0 ? '#1677ff' : 'grey' }} onClick={() => sendFirstSearch(searchMessage)}/>}
          style={{
            maxWidth: '50vw', 
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',  // Shadow effect
            height: '50px',  // Increased height
            borderRadius: '25px',
          }}
          onPressEnter={() => sendFirstSearch(searchMessage)}
        />
      </div>
      <div style={{ 
          marginTop: '8vh', 
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
              }}>
              <Text
                onClick={() => setSearchMessage(query)}
                style={{
                  color: searchMessage === query ? '#303131' : 'initial',
                  fontWeight: searchMessage === query ? 'bold' : '',
                  cursor: 'pointer',
                }}
                >{query}
              </Text>
            </div>
          </Col>
        ))}
        </Row>
      </div>
    </div>
  );
};

export default Landing;
