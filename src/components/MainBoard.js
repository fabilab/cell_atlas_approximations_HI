import React, { useState, useEffect, useRef } from 'react';
import introJs from 'intro.js';
import { ChatProvider } from './ChatContext'; 
import { useLocation, useNavigate } from 'react-router-dom';
import { resultTourSteps } from '../utils/tourConfig';
import ChatBox from './ChatBox';
import PlotBox from './PlotBox';
import { triggersPlotUpdate } from '../utils/chatSideEffects';
import { updatePlotState } from '../utils/updatePlotState';
import FeedbackForm from './FeedbackForm';

const MainBoard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const intro = useRef(introJs());
  const [firstQuery] = useState(location.state);
  const [chatHistory, setChatHistory] = useState(null);
  const [currentResponse, setCurrentResponse] = useState(null);
  const [plotState, setPlotState] = useState({"hasLog": false});

  useEffect(() => {
    // Start the tour from where it left off (if it exists)
    const savedStep = sessionStorage.getItem('currentTourStep');
    if (savedStep !== null) {
      intro.current.setOptions({
        steps: resultTourSteps, // Use the tour steps defined for MainBoard
        exitOnOverlayClick: false,
        showStepNumbers: false,
        showBullets: false,
        showProgress: true,
        initialStep: parseInt(savedStep, 10), // Start from the saved step
      });
      intro.current.start();
    }

    // Clean up: remove the saved step when the tour is finished
    intro.current.onexit(() => {
      sessionStorage.removeItem('currentTourStep');
    });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentResponse]);

  return (
      <ChatProvider>
        <div style={{ marginTop: '55px', display: 'flex', height: 'calc(100vh - 55px)'}}>
          <div id="chat-box" style={{ 
            width: "25%",
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            height: "100%",
            backgroundColor: "#e4eff7",
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            position: 'relative',
          }}
          >
            <ChatBox
              style={{ height:'100%' }}
              initialMessage={firstQuery}
              chatHistory={chatHistory}
              setChatHistory={setChatHistory}
              setCurrentResponse={setCurrentResponse}
              plotState={plotState}
            />
          </div>
          <div id="plot-box" style={{ flex: 1, overflow: 'auto'}}>
            {plotState && <PlotBox state={plotState} />}
          </div>
        </div>
        <FeedbackForm/>
      </ChatProvider>
  );
};

export default MainBoard;

