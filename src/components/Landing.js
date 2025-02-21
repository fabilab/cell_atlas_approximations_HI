import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Typography, Row, Col } from "antd";
import { RobotOutlined, SendOutlined } from "@ant-design/icons";
import FeedbackForm from "./FeedbackForm";
import search from "../asset/icon.png";
// libraries for new user tour
import introJs from "intro.js";
import "intro.js/introjs.css";
import { landingTourSteps } from "../utils/tourConfig";

const { Title } = Typography;
const { Text } = Typography;

const Landing = () => {
  const [searchMessage, setSearchMessage] = useState("");
  const navigate = useNavigate();
  const queryInput = useRef(null);
  const intro = useRef(introJs());
  
  // Hanlde the first query submitted by user
  const sendFirstSearch = useCallback((query) => {
    setSearchMessage("");
    navigate("/mainboard", { state: query });
  }, [navigate]);

  // tour for new users: https://introjs.com/docs/tour/options
  useEffect(() => {

    // Don't start tour if it was ever dismissed or completed
    const isFirstVisit = localStorage.getItem("isFirstVisit");
    const introInstance = intro.current;

    if (isFirstVisit === "false") {
      return;
    }

    if (isFirstVisit === null) {
      localStorage.setItem("isFirstVisit", "true");
    }

    introInstance.setOptions({
      steps: landingTourSteps,
      exitOnOverlayClick: false,
      showStepNumbers: false,
      showBullets: false,
      showProgress: true,
      doneLabel: "Next",
      nextLabel: "Next",
    });

    // Handle step changes
    introInstance.onbeforechange((targetElement) => {
      const currentStep = introInstance._currentStep;

      // show empty search bar
      if (currentStep === 1) {
        setSearchMessage("");
      }

      // Fill the search bar with example query
      if (currentStep === 3) {
        setSearchMessage("Show 10 markers of T cells in human blood.");
      }
    });

    // Handle early exit (X button), when user don't want to see the tour.
    introInstance.onexit(() => {
      localStorage.setItem("isFirstVisit", "false");
      localStorage.removeItem("currentTourStep");
    });

    // Handle submit step specifically
    introInstance.onafterchange(() => {
      const currentStep = introInstance._currentStep;
      if (currentStep === 3) {
        // Submit query step
        const nextButton = document.querySelector(".introjs-nextbutton");
        if (nextButton && !nextButton.hasAttribute("data-clicked")) {
          nextButton.addEventListener("click", () => {
            // transition to mainboard and continue the tour
            localStorage.setItem("currentTourStep", "4");
            sendFirstSearch("Show 10 markers of T cells in human blood.");
          });
          nextButton.setAttribute("data-clicked", true);
        }
      }
    });

    // Start tour
    introInstance.start();

    return () => {
      // Cleanup
      const nextButton = document.querySelector(".introjs-nextbutton");
      if (nextButton) {
        nextButton.removeEventListener("click", () => {
          sendFirstSearch("Show 10 markers of T cells in human blood.");
        });
      }
    };
  }, [sendFirstSearch]);

  const sampleQueries = [
    'What species are available?',
    'Explore lemur',
    'What cell types are there in mouse liver?',
    'Show profile of neutrophil',
    'What are markers for all cells in mouse lung?',
    'Show 10 markers of T cells in human blood.',
    'Show interactors of NOTCH1 in human heart.',
    'What organisms have chromatin accessibility?',
    'Show 10 genes similar to Col1a1 in mouse lung.',
    "What cells coexpress CD19 and MS4A1 in human?",
    'Show organs containing macrophage across species.',
    'What cell types are present in each organ of mouse?',
    'What cell type is the highest expressor of Cd19 in mouse?',
    'What are the 3 top surface markers of NK cells in human liver?',
    'What are the homologs of MS4A1,GP6,COL1A1 from human to mouse?',
    'Show the 10 top marker peaks for cardiomyocyte in h_sapiens heart.',
    'Show 10 markers for fibroblast in human lung compared to other tissues.',
    'What is the expression of COL13A1, COL14A1, TGFBI, PDGFRA, GZMA in human lung?',
    'What are the cell states of ML358828a, ML071151a, ML065728a in jellyfish whole?',
    'Compare fraction expressing PTPRC, MARCO, CD68, CD14 in macrophage across organs in human.',
    'What is the chromatin accessibility of chr1:9955-10355, chr10:122199710-122200110 in human lung?',
  ];

  return (
    <div
      className="landing-page"
      style={{
        background:
          "linear-gradient(to bottom right, #bde7ff 10%, #ffffff, #ffffff 70%, #faf7c0 100%)",
        height: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "24vh",
        }}
      >
        <img
          src={search}
          alt="search icon"
          style={{ marginRight: "10px", height: "70px" }}
        />
        <Title
          level={2}
          style={{
            margin: 0,
            fontFamily: "Arial, sans-serif",
            color: "#303131",
            lineHeight: "1.6",
          }}
        >
          Explore Cell Atlas Approximations
        </Title>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "8vh",
        }}
      >
        <div
          id="search-container"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "50vw",
          }}
        >
          <Input
            placeholder="Ask me a question OR click on one below..."
            ref={queryInput}
            value={searchMessage}
            onChange={(e) =>
              setSearchMessage(e.target.value.replace(/(\r\n|\n|\r)/gm, ""))
            }
            prefix={
              <RobotOutlined
                style={{
                  paddingRight: "10px",
                  color: searchMessage.length > 0 ? "#1677ff" : "grey",
                }}
              />
            }
            suffix={
              <SendOutlined
                style={{
                  paddingLeft: "10px",
                  color: searchMessage.length > 0 ? "#1677ff" : "grey",
                }}
                onClick={() => sendFirstSearch(searchMessage)}
              />
            }
            style={{
              width: "100%",
              boxShadow: " 0 4px 8px rgba(0, 0, 0, 0.15)",
              height: "50px",
              borderRadius: "25px",
            }}
            onPressEnter={() => sendFirstSearch(searchMessage)}
          />
        </div>
      </div>
      <div
        id="example-query"
        style={{
          marginTop: "8vh",
          color: "#303131",
          marginLeft: "5%",
          marginRight: "5%",
        }}
      >
        <Row
          gutter={{
            xs: 8,
            sm: 16,
            md: 24,
            lg: 32,
          }}
        >
          {sampleQueries.map((query, index) => (
            <Col span={12} key={index}>
              <div
                style={{
                  marginBottom: "2vh",
                  textAlign: index % 2 === 1 ? "left" : "right",
                }}
              >
                <Text
                  id={`query-${index}`}
                  onClick={() => {
                    setSearchMessage(query);
                    queryInput.current.focus();
                  }}
                  style={{
                    color: searchMessage === query ? "#303131" : "initial",
                    fontWeight: searchMessage === query ? "bold" : "",
                    cursor: "pointer",
                  }}
                >
                  {query}
                </Text>
              </div>
            </Col>
          ))}
        </Row>
      </div>
      <FeedbackForm />
    </div>
  );
};

export default Landing;
