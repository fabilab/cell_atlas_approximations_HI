import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Row, Col } from 'antd';
import FeedbackForm from './FeedbackForm';
import search from '../asset/icon.png';
import Autocomplete from './Autocomplete';
const { Title } = Typography;
const { Text } = Typography;




const Landing = () => {

  const [searchMessage, setSearchMessage] = useState('')
  const [focusQuery, setFocusQuery] = useState(false);
  const navigate = useNavigate();

  const sendFirstSearch = (query) => {
    setSearchMessage('');
    navigate("/mainboard", { state: query });
  }

  const sampleQueries = [
    'What species are available?',
    'Explore lemur',
    // 'What organs are available in human?',
    'What cell types are there in mouse liver?',
    'show interactors of NOTCH1 in human heart.',
    // 'show interactors of COL1A1 in human heart.',
    'Show 10 markers of rod cells in the frog eye.',
    'What are markers for all cells in mouse lung?',
    'What organisms have chromatin accessibility?',
    'Show 10 genes similar to Col1a1 in mouse lung.',
    "What cells coexpress CD19 and MS4A1 in human?",
    'Show organs containing macrophage across species.',
    'What cell types are present in each organ of mouse?',
    'What cell type is the highest expressor of GZMA in human?',
    'What are the sequences of COL1A1,CD19,ALK,VWF in human?',
    // 'List highest accessibility of chr6:98834292-98834692 in human.',
    'Show 10 markers for fibroblast in human lung compared to other tissues.',
    'Show the 10 top marker peaks for cardiomyocyte in h_sapiens heart.',
    'What are the homologs of MS4A1,GP6,COL1A1 from human to mouse?',
    'What is the expression of COL13A1, COL14A1, TGFBI, PDGFRA, GZMA in human lung?',
    'What are the cell states of ML358828a, ML071151a, ML065728a in jellyfish whole?',
    'Compare fraction expressing PTPRC, MARCO, CD68, CD14 in macrophage across organs in human.',
    'What is the chromatin accessibility of chr1:9955-10355, chr10:122199710-122200110 in human lung?',
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
      <Autocomplete
        searchMessage={searchMessage}
        setSearchMessage={setSearchMessage}
        sendFirstSearch={sendFirstSearch}
        focus={focusQuery}
      />
      <div style={{ 
          marginTop: '8vh', 
          // fontWeight: 'bold', 
          color: '#303131', 
          marginLeft:'5%',
          marginRight: '5%',
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
                onClick={() => { setSearchMessage(query); setFocusQuery(!focusQuery); }}
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
