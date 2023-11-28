import React, { useState, useEffect } from 'react';
import { ChatProvider } from './ChatContext'; 
import { useLocation, useNavigate } from 'react-router-dom';
import ChatBox from './ChatBox';
import PlotBox from './PlotBox';
import { triggersPlotUpdate } from '../utils/chatSideEffects';
import { updatePlotState } from '../utils/updatePlotState';
import { Modal, Button } from 'antd';

const MainBoard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const firstQuery = location.state;
  const [chatHistory, setChatHistory] = useState(null);
  const [currentResponse, setCurrentResponse] = useState(null);
  const [plotState, setPlotState] = useState({"hasLog": false});
  const [confirmationModal, setConfirmationModal] = useState(false);
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

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      setConfirmationModal(true);
    };

    window.addEventListener('beforeunload', handleBeforeUnload); // page refresh

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const handlePageBack = (event) => {
      event.preventDefault();
      console.log("clicking button back..");
      setConfirmationModal(true);
    };

    window.addEventListener('popstate', handlePageBack); // back button

    return () => {
      window.removeEventListener('popstate', handlePageBack);
    };
  }, []);

  useEffect(() => {
    if (triggersPlotUpdate(currentResponse)) {
      updatePlotState(currentResponse, plotState, setPlotState);
    } 
  }, [currentResponse]);

  const handleLeavePage = (decision) => {
    setConfirmationModal(false);
    if (decision) {
      navigate('/');
    }
  };

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
      <Modal
        title="Leave Page Confirmation"
        open={confirmationModal}
        onOk={() => handleLeavePage(true)}
        onCancel={() => handleLeavePage(false)}
      >
        <p>If you leave the page, everything will be lost. Are you sure?</p>
      </Modal>
    </ChatProvider>
  );
};

export default MainBoard;

