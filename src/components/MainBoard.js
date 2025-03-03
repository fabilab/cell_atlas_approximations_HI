import React, { useState, useEffect, useRef } from "react";
import introJs from "intro.js";
import { ChatProvider } from "./ChatContext";
import { useLocation, useNavigate } from "react-router-dom";
import { resultTourSteps } from "../utils/tourConfig";
import ChatBox from "./ChatBox";
import PlotBox from "./PlotBox";
import { triggersPlotUpdate } from "../utils/chatSideEffects";
import { updatePlotState } from "../utils/updatePlotState";
import FeedbackForm from "./FeedbackForm";

const MainBoard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const intro = useRef(introJs());
  const [firstQuery] = useState(location.state);
  const [chatHistory, setChatHistory] = useState(null);
  const [currentResponse, setCurrentResponse] = useState(null);
  const [plotState, setPlotState] = useState({ hasLog: false });

  useEffect(() => {
    // Continue the new user tour from previou page
    const currentTourStep = localStorage.getItem("currentTourStep");
    const introInstance = intro.current;

    if (currentTourStep) {
      introInstance.setOptions({
        steps: resultTourSteps,
        exitOnOverlayClick: false,
        showStepNumbers: false,
        showBullets: false,
        showProgress: true,
        doneLabel: "Done",
      });

      // Redirect to home page when tour is completed
      introInstance.oncomplete(() => {
        localStorage.setItem("isFirstVisit", "false");
        localStorage.removeItem("currentTourStep");
        navigate("/");
      });

      // Handle early exit (X button)
      introInstance.onexit(() => {
        localStorage.setItem("isFirstVisit", "false");
        localStorage.removeItem("currentTourStep");
        navigate("/");
      });

      // Handle step changes
      introInstance.onafterchange((targetElement) => {
        const currentStep = introInstance._currentStep;
        localStorage.setItem("currentTourStep", (currentStep + 4).toString()); // +4 to account for landing steps
      });

      introInstance.start();
    }

    // Cleanup function
    return () => {
      introInstance.exit();
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
      <div
        style={{
          marginTop: "55px",
          display: "flex",
          height: "calc(100vh - 55px)",
        }}
      >
        <div
          id="chat-box"
          style={{
            width: "25%",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            height: "100%",
            backgroundColor: "#e4eff7",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
            position: "relative",
          }}
        >
          <ChatBox
            style={{ height: "100%" }}
            initialMessage={firstQuery}
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            setCurrentResponse={setCurrentResponse}
            plotState={plotState}
          />
        </div>
        <div id="plot-box" style={{ flex: 1, overflow: "auto" }}>
          {plotState && <PlotBox state={plotState} />}
        </div>
      </div>
      <FeedbackForm />
    </ChatProvider>
  );
};

export default MainBoard;
