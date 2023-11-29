import React, { useState, useEffect } from 'react';
import { ChatProvider } from './ChatContext'; 
import { useLocation, useNavigate } from 'react-router-dom';
import ChatBox from './ChatBox';
import PlotBox from './PlotBox';
import { triggersPlotUpdate } from '../utils/chatSideEffects';
import { updatePlotState } from '../utils/updatePlotState';
import { Modal } from 'antd';

const MainBoard = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const firstQuery = location.state;
  const [chatHistory, setChatHistory] = useState(null);
  const [currentResponse, setCurrentResponse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [plotState, setPlotState] = useState({"hasLog": false});
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);

   // when user tries to refresh the page
    const handlePageRefresh = (event) => {
      event.preventDefault();
      setShowModal(true);
    };
    window.addEventListener('beforeunload', handlePageRefresh, false); // page refresh
    window.onbeforeunload = (e) => handlePageRefresh(e)

    // when user clicks the go back button on the browser
    const handlePageBack = (event) => {
      console.log("user wants to go back to the previous page");
      setShowModal(true);
    }
    window.addEventListener('popstate', handlePageBack); 


    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('beforeunload', handlePageRefresh );
      window.onbeforeunload = (e) => {return null};
      window.removeEventListener('popstate', handlePageBack);
    };
  }, []);

  useEffect(() => {
    if (triggersPlotUpdate(currentResponse)) {
      updatePlotState(currentResponse, plotState, setPlotState);
    } 
  }, [currentResponse]);

  const handleLeavePage = (decision) => {
    setShowModal(false);
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
        open={showModal}
        onOk={() => handleLeavePage(true)}
        onCancel={() => handleLeavePage(false)}
        >
          <p>If you leave the page, everything will be lost. Are you sure?</p>
      </Modal>
    </ChatProvider>
  );
};

export default MainBoard;

