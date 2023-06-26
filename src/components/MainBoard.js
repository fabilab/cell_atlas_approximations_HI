import React, { useState, useEffect } from 'react';
import { Layout, Card } from 'antd';

import ChatBox from './ChatBox';
import PlotBox from './PlotBox';
import Navbar from './Navbar';

import Landing from './Landing';

const { Content } = Layout;

// Source code: https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript
function transpose(matrix) {
  if (matrix.length === 0) {
    return matrix;
  }
  return matrix[0].map((col, c) => matrix.map((row, r) => matrix[r][c]));
}

const MainBoard = () => {

  const [userInstructions, setUserInstructions] = useState([]);
  const [plotState, setPlotState] = useState(null);
  // message string that the user is typing
  const [currentMessage, setCurrentMessage] = useState('');
  

  useEffect(() => {
    if (userInstructions.length === 0) return;
    const latestResponse = userInstructions.slice(-1)[0].response;
    if (latestResponse.plot) updatePlotState(latestResponse);
  }, [userInstructions]);

  const updatePlotState = async (response) => {
    const intent = response.intent;
    let generalIntent = intent.split(".")[0];
    let newPlotState = null;

    if (generalIntent === "add") {
      const updatedFeatures = plotState.features.concat(response.params.features.split(','));
      response.data = await window.atlasapproxAPI("average", {
        organism: plotState.organism,
        organ: plotState.organ,
        features: updatedFeatures.join(',')
      });
      generalIntent = 'average';
    }

    const organism = response.data.organism;
    const organ = response.data.organ;
    const features = response.data.features;

    const celltypesResponse = await window.atlasapproxAPI("celltypes", { organism, organ });
    const celltypes = celltypesResponse.celltypes;

    let average, fractions;
    if (generalIntent === "average") {
      average = response.data.average ? transpose(response.data.average) : null;
      const plotType = "heatmap";
      newPlotState = {
        intent,
        plotType,
        organism,
        organ,
        features,
        data: {
          type: "matrix",
          xaxis: celltypes,
          yaxis: features,
          average: average,
          fractions: null,
          valueUnit: "counts per ten thousand"
        }
      };
    //   console.log("new plot state for heatmap average!!!====");
    //   console.log(newPlotState);
    } else if (generalIntent === "fraction_detected") {
      fractions = response.data.fraction_detected ? transpose(response.data.fraction_detected) : null;
      let averageResponse = await window.atlasapproxAPI("average", {
        organism,
        organ,
        features
      });
      console.log("fraction ======")
      console.log(averageResponse);
      averageResponse.average = averageResponse.average ? transpose(averageResponse.average) : null;
      console.log(fractions);
      const plotType = "bubbleHeatmap";
      newPlotState = {
        intent,
        plotType,
        organism,
        organ,
        features,
        data: {
          type: "matrix",
          xaxis: celltypes,
          yaxis: features,
          average: averageResponse.average,
          fractions: fractions,
          valueUnit: "counts per ten thousand"
        }
      };
    }

    setPlotState(newPlotState);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <ChatBox 
        userInstructions={userInstructions} 
        setUserInstructions={setUserInstructions}
        currentMessage={currentMessage}
        setCurrentMessage={setCurrentMessage}
      />
      <Layout style={{ backgroundColor: "#fafafa" }}>
        <Navbar />
        {plotState ? (
          <Content>
            <div style={{ height: "5vh" }}></div>
            <Card style={{ backgroundColor: 'white', height: "73vh", margin: "2%", marginTop: "0px" }}>
              <div id='canvasId' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <PlotBox state={plotState} />
              </div>
            </Card>
          </Content>
        )
        :
        <Content style={{ margin: "30px", backgroundColor: "inherit" }}>
            <Landing
              currentMessage={currentMessage}
              setCurrentMessage={setCurrentMessage}
            />
        </Content>
        
        }
      </Layout>
    </Layout>
  );
};

export default MainBoard;
