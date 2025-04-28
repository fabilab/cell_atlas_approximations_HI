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

  // Handle the first query submitted by user
  const sendFirstSearch = useCallback(
    (query) => {
      setSearchMessage("");
      navigate("/mainboard", { state: query });
    },
    [navigate]
  );

  // Tour for new users: https://introjs.com/docs/tour/options
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

      // Show empty search bar
      if (currentStep === 1) {
        setSearchMessage("");
      }

      // Fill the search bar with example query
      if (currentStep === 3) {
        setSearchMessage("Show 10 markers of T cells in human blood.");
      }
    });

    // Handle early exit (X button), when user doesn't want to see the tour
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
            // Transition to mainboard and continue the tour
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
    "What species are available?",
    "Explore lemur",
    "Show 10 markers of T cells in human blood.",
    "Show profile of neutrophil",
    // FIXME: the api failed to return data with the parameters (500 error):
    // "What are markers for all cells in mouse lung?",
    "Show interactors of INS in human pancreas",
    "What organisms have chromatin accessibility?",
    "Show 10 genes similar to Col1a1 in mouse lung.",
    "What cells coexpress CD19 and MS4A1 in human?",
    "Show organs containing macrophage across species.",
    "What cell types are present in each organ of mouse?",
    "What cell type is the highest expressor of Cd19 in mouse?",
    "What are the sequences of PRDM1, PTPRC, ACTB in human?",
    "What are the 3 top surface markers of NK cells in human liver?",
    "What are the homologs of MS4A1,GP6,COL1A1 from human to mouse?",
    "Show 10 markers for fibroblast in human lung compared to other tissues.",
    "What is the expression of CD68, MARCO, SFTPC, PDGFRA in human lung?",
    "What cell type is the highest expressor of KRT8, CDH1 but not ACTA2 in human?",
    "What are the cell states of ML358828a, ML071151a, ML065728a in jellyfish whole?",
    "Compare fraction expressing CD68, CSF1R, MRC1, CX3CR1 in macrophage across organs in human.",
    "What is the chromatin accessibility of chr1:9955-10355, chr10:122199710-122200110 in human lung?",
  ];

  return (
    <div
      className="landing-page"
      style={{
        background:
          "linear-gradient(to bottom right, #bde7ff 10%, #ffffff, #ffffff 70%, #faf7c0 100%)",
        minHeight: "100vh", // Changed from height to minHeight
        paddingBottom: "2rem", // Added to ensure content isn't flush with the bottom
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "23vh",
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
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
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