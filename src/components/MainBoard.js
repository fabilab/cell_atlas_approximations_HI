import React, { useState, useEffect } from 'react';
import { Layout, Card } from 'antd';
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
      console.log("updating plot!!!!!! =========")
      console.log(triggersPlotUpdate(currentResponse));
      updatePlotState(currentResponse, plotState, setPlotState);
      setShowLanding(false);
    }
  }, [currentResponse]);
 
  // Generate and update plot according to user intends

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
        <Content style={{ margin: "30px", backgroundColor: "inherit" }}>
          {showLanding ? (
            <Landing
              currentMessage={currentMessage}
              setCurrentMessage={setCurrentMessage}
            />
          ) : (
            plotState && <PlotBox state={plotState} />
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainBoard;
