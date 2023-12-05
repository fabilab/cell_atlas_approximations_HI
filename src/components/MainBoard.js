import React, { useState, useEffect } from 'react';
import { ChatProvider } from './ChatContext'; 
import { useLocation, useNavigate } from 'react-router-dom';
import ChatBox from './ChatBox';
import PlotBox from './PlotBox';
import { triggersPlotUpdate } from '../utils/chatSideEffects';
import { updatePlotState } from '../utils/updatePlotState';
import FeedbackForm from './FeedbackForm';

const MainBoard = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const [firstQuery, setFirstQuery] = useState(location.state);
  const [chatHistory, setChatHistory] = useState(null);
  const [currentResponse, setCurrentResponse] = useState(null);
  const [plotState, setPlotState] = useState({"hasLog": false});
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  //  The following code was adapted from guidance provided by OpenAI's GPT-4.
  useEffect(() => {
    // Set a flag in sessionStorage on component mount
    if (!sessionStorage.getItem('MainBoardLoaded')) {
      sessionStorage.setItem('MainBoardLoaded', 'true');
    } else {
      navigate('/');
    }

    // Add a simple beforeunload event listener
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = ''; // Setting returnValue is necessary
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      sessionStorage.removeItem('MainBoardLoaded');
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [navigate]);

  useEffect(() => {
    if (triggersPlotUpdate(currentResponse)) {
      updatePlotState(currentResponse, plotState, setPlotState);
    } 
  }, [currentResponse]);

  return (
    <ChatProvider>
      <div style={{ marginTop: '55px', display: 'flex', height: 'calc(100vh - 55px)'}}>
          <ChatBox
            style={{ height:'100%' }}
            initialMessage={firstQuery}
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            setCurrentResponse={setCurrentResponse}
            plotState={plotState}
          />
          <div style={{ flex: 1, overflow: 'auto'}}>
            {plotState && <PlotBox state={plotState} />}
          </div>
         
      </div>
      <FeedbackForm/>
    </ChatProvider>
  );
};

export default MainBoard;

