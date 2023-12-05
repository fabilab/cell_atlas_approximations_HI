import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Typography, Row, Col } from 'antd';
import { RobotOutlined, SendOutlined } from '@ant-design/icons';
import FeedbackForm from './FeedbackForm';
import search from '../asset/icon.png';
const { Title } = Typography;
const { Text } = Typography;



const Landing = () => {

  const [searchMessage, setSearchMessage] = useState('')
  const navigate = useNavigate();

  const sendFirstSearch = (query) => {
    console.log('Sending first search:', query);
    setSearchMessage('');
    navigate("/mainboard", { state: query });
  }

  const sampleQueries = [
    'What species are available?',
    'Explore frog.',
    'What organs are available in human?',
    'Where are fibroblast detected in human?',
    'What organisms have chromatin accessibility?',
    'Show 10 markers of rod cells in the frog eye.',
    'Show 10 genes similar to Col1a1 in mouse lung.',
    'What cell types are present in each organ of mouse?',
    'What cell type is the highest expressor of GZMA in human?',
    'List highest accessibility of chr1:9955-10355 in human.',
    'What are the sequences of COL1A1,CD19,ALK,VWF in human?',
    'What is the chromatin accessibility of chr1:9955-10355, chr10:122199710-122200110 in human lung?',
    // 'show 5 cell types with similar chromatin peaks to lung fibroblast in human.',
    'What are the cell states of ML25764a, ML358828a, ML071151a, ML065728a in jellyfish whole?',
    'What is the expression of VWF, APOE, COL13A1, COL14A1, TGFBI, PDGFRA, GZMA in human lung?',
    'What is the fraction of cells expressing ACE2, FOXJ1, HIF1A, KRT5, VWF, CD19, APOE, GZMA in human lung?',
    'Compare fraction expressing PTPRC, MARCO, CD68, CD14 in macrophage across organs in human.',
  ];

  return (
    <div className="landing-page" style={{
      background: 'linear-gradient(to bottom right, #bde7ff 10%, #ffffff, #ffffff 70%, #faf7c0 100%)',
      height: '100vh'
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
          placeholder="Ask me a question OR click on one below..."
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
          marginLeft:'12%',
          marginRight: '12%',
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
      <FeedbackForm/>
    </div>
  );
};

export default Landing;
