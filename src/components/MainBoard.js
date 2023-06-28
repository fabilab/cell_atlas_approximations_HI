import React, { useState, useEffect } from 'react';
import { Layout, Card } from 'antd';
import ChatBox from './ChatBox';
import PlotBox from './PlotBox';
import TableBox from './TableBox';
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
  const [tableData,setTableData] = useState(null);
  // message string that the user is typing
  const [currentMessage, setCurrentMessage] = useState('');
  

  useEffect(() => {
    if (userInstructions.length === 0) return;
    const latestResponse = userInstructions.slice(-1)[0].response;
    console.log("Intend is " + latestResponse.intent);
    if (latestResponse.intent === "markers.geneExpression") {
      latestResponse.plot = true;
    }
    if (latestResponse.intent === "highest_measurement.geneExpression") {
      latestResponse.plot = true;
    }
    if (latestResponse.intent === "celltypexorgan") {
      updateTable(latestResponse);
    }
    if (latestResponse.plot) updatePlotState(latestResponse);
  }, [userInstructions]);

 
  // Generate and update plot according to user intends
  const updatePlotState = async (response) => {
    const intent = response.intent;
    let generalIntent = intent.split(".")[0];
    let newPlotState = null;
    let average, fractions;

    if (generalIntent === "add") {
      const updatedFeatures = plotState.features + "," + response.params.features.split(',');
      fractions = plotState.data.fractions;

      // check if the "add" action apply to average or fraction
      if(!fractions) {
        console.log("No fraction, only average expression");
        response.data = await window.atlasapproxAPI("average", {
          organism: plotState.organism,
          organ: plotState.organ,
          features: updatedFeatures,
        });
        generalIntent = 'average';
      } else {
        response.data = await window.atlasapproxAPI("fraction_detected", {
          organism: plotState.organism,
          organ: plotState.organ,
          features: updatedFeatures,
        });
        generalIntent = 'fraction_detected';
      }
    }

    let organism = response.data.organism;
    let organ = response.data.organ;
    let features = response.data.features;

    const celltypesResponse = await window.atlasapproxAPI("celltypes", { organism, organ });
    const celltypes = celltypesResponse.celltypes;

    if (generalIntent === "markers") {
      const markerFeatures = response.data.markers;
      response.data = await window.atlasapproxAPI("fraction_detected", {
        organism: organism,
        organ: organ,
        features: markerFeatures,
      });
      features = markerFeatures;
      generalIntent = 'fraction_detected';
      
    }

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
    } 
    
    if (generalIntent === "fraction_detected") {
      fractions = response.data.fraction_detected ? transpose(response.data.fraction_detected) : null;
      let averageResponse = await window.atlasapproxAPI("average", {
        organism,
        organ,
        features
      });
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

    if (generalIntent === "highest_measurement") {
      organism = response.params.organism;
      let gene = response.params.feature;
      const highestResponse = await window.atlasapproxAPI("highest_measurement", {
        organism: organism,
        feature: gene,
        number: 15,
      });
      const plotType = "barChart"
      // update plot state for bar chart
      let organs = highestResponse.organs;
      let celltypes = highestResponse.celltypes;
      const xaxis = celltypes.map((c, index) => {
        return c + ' (' + organs[index] + ')'
      })
      newPlotState = {
        intent,
        plotType,
        organism,
        organs,
        celltypes,
        gene,
        data: {
          type: "matrix",
          xaxis: xaxis,
          yaxis: highestResponse.average,
          average: highestResponse.average,
          fractions: null,
          valueUnit: "counts per ten thousand"
        }
      };
      console.log(celltypes);
    }

    setPlotState(newPlotState);
  };

  const updateTable = async(response) => {
    // const tempResponse = await window.atlasapproxAPI("celltypes", { organism, organ });
    let newTableData = null;
    let organism = response.params.organism;
    let organs = response.data.organs;
    let celltypes = response.data.celltypes;
    let detected = response.data.detected;
    newTableData = {
      organism,
      organs,
      celltypes,
      detected
    };

    setTableData(newTableData);
    console.log("table state is")
    console.log(newTableData);
  }


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
        <Content style={{ margin: "30px", backgroundColor: "inherit" }}>
          {tableData ? (
            <TableBox state={tableData} />
          ) : plotState ? (
            <div id='canvasId' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <PlotBox state={plotState} />
            </div>
          ) : (
            <Landing
              currentMessage={currentMessage}
              setCurrentMessage={setCurrentMessage}
            />
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainBoard;
