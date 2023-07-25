import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import ChatBox from './ChatBox';
import PlotBox from './PlotBox';
import Navbar from './Navbar';
import Landing from './Landing';
import { triggersPlotUpdate } from '../utils/chatSideEffects';
import { updatePlotState } from '../utils/updatePlotState';

const { Content } = Layout;

const MainBoard = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [currentResponse, setCurrentResponse] = useState(null);
  const [plotState, setPlotState] = useState(null);
  const [showLanding, setShowLanding] = useState(true);
  // message string that the user is typing
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    if (triggersPlotUpdate(currentResponse)) {
      updatePlotState(currentResponse, plotState, setPlotState);
      setShowLanding(false);
      console.log("changing current response....");
      console.log(currentResponse);
    }
  }, [currentResponse]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <ChatBox
        chatHistory={chatHistory}
        setChatHistory={setChatHistory}
        currentMessage={currentMessage}
        setCurrentMessage={setCurrentMessage}
        setCurrentResponse={setCurrentResponse}
        plotState={plotState}
      />
      <Layout style={{ backgroundColor: "white" }}>
        <Navbar
          setShowLanding={setShowLanding}
        />
         <div>
          <Content style={{ 
            backgroundColor: "inherit",
            overflow: "auto", // scrollable
            height: "calc(100vh - 100px)", // Set a fixed height to enable scrolling
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
      </Layout>
    </Layout>
  );
};

export default MainBoard;
