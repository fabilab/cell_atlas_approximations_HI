import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ChatBox from './ChatBox';
import PlotBox from './PlotBox';
import { triggersPlotUpdate } from '../utils/chatSideEffects';
import { updatePlotState } from '../utils/updatePlotState';

const MainBoard = () => {
  const location = useLocation();
  const firstQuery = location.state;
  const [chatHistory, setChatHistory] = useState([]);
  const [currentResponse, setCurrentResponse] = useState(null);
  const [plotState, setPlotState] = useState({"hasLog": false});
  const [currentMessage, setCurrentMessage] = useState(firstQuery);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  // console.log(currentResponse);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  useEffect(() => {
    if (triggersPlotUpdate(currentResponse)) {
      console.log("here's the current response, which triggers a plot update:");
      // console.log(currentResponse);
      updatePlotState(currentResponse, plotState, setPlotState);
    } else {
      console.log("here's the current response, which does not trigger a plot update:");
      // console.log(currentResponse);
    }
  }, [currentResponse]);

  return (
    <div style={{ marginTop: '55px', display: 'flex', height: 'calc(100vh - 55px)'}}>
        <ChatBox
          style={{ height:'100%' }}
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
          currentMessage={currentMessage}
          setCurrentMessage={setCurrentMessage}
          setCurrentResponse={setCurrentResponse}
          plotState={plotState}
        />
      <div style={{ flex: 1, margin:'10px', overflow: 'auto'}}>
        {plotState && <PlotBox state={plotState} />}
      </div>
    </div>
  );
};

export default MainBoard;

