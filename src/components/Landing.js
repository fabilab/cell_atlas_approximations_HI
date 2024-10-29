import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Typography, Row, Col } from 'antd';
import { RobotOutlined, SendOutlined } from '@ant-design/icons';
import FeedbackForm from './FeedbackForm';
import search from '../asset/icon.png';
// libraries for new user tour
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import Cookies from 'js-cookie';
import { landingTourSteps } from '../utils/tourConfig';

const { Title } = Typography;
const { Text } = Typography;


// check the cookie....
const Landing = () => {

  const [searchMessage, setSearchMessage] = useState('')
  const navigate = useNavigate();
  const queryInput = useRef(null);
  const intro = useRef(introJs());

  // https://introjs.com/docs/tour/options
  useEffect(() => {
    intro.current.setOptions({
      steps: landingTourSteps,
      exitOnOverlayClick: false,
      showStepNumbers: false,
      showBullets: false,
      showProgress: true,
      doneLabel: 'Next',
      nextLabel: 'Next',
    });
  
    // Handle both empty and filled states for search input
    intro.current.onbeforechange((targetElement) => {
      const currentStep = intro.current._currentStep;
      
      // Clear search on first search step
      if (currentStep === 1) {
        setSearchMessage('');
      }
      
      // Fill search on last step
      if (currentStep === 3) {
        setSearchMessage('Show 10 markers of T cells in human blood.');
      }
    });
  
    // Handle query submission at the last step
    intro.current.onafterchange((targetElement) => {
      const currentStep = intro.current._currentStep;
      if (currentStep === 3) {
        const nextButton = document.querySelector('.introjs-nextbutton');
        if (!nextButton.hasAttribute('data-clicked')) {
          nextButton.addEventListener('click', () => {
            sendFirstSearch('Show 10 markers of T cells in human blood.');
            intro.current.exit();
          });
          nextButton.setAttribute('data-clicked', true);
        }
      }
    });
  
    // Clean up
    return () => {
      const nextButton = document.querySelector('.introjs-nextbutton');
      if (nextButton) {
        nextButton.removeEventListener('click', () => {
          sendFirstSearch('Show 10 markers of T cells in human blood.');
          intro.current.exit();
        });
      }
    };
  }, []);
  
  // Start tour
  useEffect(() => {
    const tourCompleted = Cookies.get('tourCompleted');
    if (!tourCompleted) {
      setTimeout(() => {
        intro.current.start();
      }, 600);
    }
  }, []);


  const sendFirstSearch = (query) => {

    // Save current step before navigating
    const currentStep = intro.current._currentStep; 
    sessionStorage.setItem('currentTourStep', currentStep); // Save current step in sessionStorage

    setSearchMessage('');
    navigate("/mainboard", { state: query });
    // Cookies.set('tourCompleted', 'true', { expires: 365 });
  }

  // textInput must be declared here so the ref can refer to it

  const sampleQueries = [
    'What species are available?',
    'Explore lemur',
    'What cell types are there in mouse liver?',
    'show interactors of NOTCH1 in human heart.',
    'Show 10 markers of T cells in human blood.',
    'What are markers for all cells in mouse lung?',
    'What organisms have chromatin accessibility?',
    'Show 10 genes similar to Col1a1 in mouse lung.',
    "What cells coexpress CD19 and MS4A1 in human?",
    'Show organs containing macrophage across species.',
    'What cell types are present in each organ of mouse?',
    'What cell type is the highest expressor of Cd19 in mouse?',
    'what are the 3 top surface markers of NK cells in human liver?',
    'Show the 10 top marker peaks for cardiomyocyte in h_sapiens heart.',
    'What are the homologs of MS4A1,GP6,COL1A1 from human to mouse?',
    'Show 10 markers for fibroblast in human lung compared to other tissues.',
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
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginTop: '8vh' 
      }}>
       <div id="search-container" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          width: '50vw',
        }}>
          <Input
            placeholder="Ask me a question OR click on one below..."
            ref={queryInput}
            value={searchMessage}
            onChange={(e) => setSearchMessage(e.target.value.replace(/(\r\n|\n|\r)/gm, ""))}
            prefix={<RobotOutlined style={{ paddingRight: '10px', color: searchMessage.length > 0 ? '#1677ff' : 'grey' }}/> }
            suffix={<SendOutlined style={{paddingLeft: '10px', color: searchMessage.length > 0 ? '#1677ff' : 'grey' }} onClick={() => sendFirstSearch(searchMessage)}/>}
            style={{
              width: '100%',
              boxShadow: ' 0 4px 8px rgba(0, 0, 0, 0.15)',
              height: '50px',
              borderRadius: '25px',
            }}
            onPressEnter={() => sendFirstSearch(searchMessage)}
          />
        </div>
      </div>
      <div id="example-query"
        style={{ 
          marginTop: '8vh', 
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
                id={`query-${index}`} 
                onClick={() => { setSearchMessage(query); queryInput.current.focus(); }}
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
