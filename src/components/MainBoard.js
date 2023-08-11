import React, { useState, useEffect } from 'react';
import { Layout, Row, Col } from 'antd';
import { useLocation } from 'react-router-dom';
import ChatBox from './ChatBox';
import PlotBox from './PlotBox';
import { triggersPlotUpdate } from '../utils/chatSideEffects';
import { updatePlotState } from '../utils/updatePlotState';

const { Content } = Layout;

const MainBoard = () => {

  // Get the first user's query from Landing page
  const location = useLocation();
  const firstQuery = location.state;
  
  const [chatHistory, setChatHistory] = useState([]);
  const [currentResponse, setCurrentResponse] = useState(null);
  const [plotState, setPlotState] = useState(null);
  const [showLanding, setShowLanding] = useState(true);
  // message string that the user is typing
  const [currentMessage, setCurrentMessage] = useState(firstQuery);

  useEffect(() => {
    if (triggersPlotUpdate(currentResponse)) {
      updatePlotState(currentResponse, plotState, setPlotState);
      setShowLanding(false);
      console.log("changing current response....");
      console.log(currentResponse);
    }
  }, [currentResponse]);

  return (
    <div style={{ height: "95vh", marginTop:'55px'}}>
      <Row style={{height:"inherit"}} >
        <Col span={7}>
          <ChatBox
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            currentMessage={currentMessage}
            setCurrentMessage={setCurrentMessage}
            setCurrentResponse={setCurrentResponse}
            plotState={plotState}
          />
        </Col>
        <Col span={17}>
          {
            plotState &&
            <PlotBox state={plotState} 
            />
          }
          
        </Col>
      </Row>
       {/*
      <Layout style={{ backgroundColor: "white" }}>
        <Navbar
          setShowLanding={setShowLanding}
        />
         <div>
          <Content style={{ 
            backgroundColor: "inherit",
            overflow: "auto", // scrollable
            height: "calc(100vh - 100px)", // Set a fixed height to enable scrolling
            marginTop:"7vh",
            }}>
            {showLanding ? (
              <Landing
                currentMessage={currentMessage}
                setCurrentMessage={setCurrentMessage}
              />
            ) : (
              plotState && 
              <PlotBox state={plotState} 
                style={{ 
                 marginTop: "100px"
                }}
              />
            )}
          </Content>
        </div>
      </Layout> */}
    </div>
  );
};

export default MainBoard;