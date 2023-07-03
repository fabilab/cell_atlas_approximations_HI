import React, { useState, useEffect } from 'react';
import { Layout, Card } from 'antd';
import ChatBox from './ChatBox';
import PlotBox from './PlotBox';
import TableBox from './TableBox';
import Navbar from './Navbar';
import atlasapprox from 'atlasapprox';
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
  
  const intents = [
    "markers.geneExpression",
    "highest_measurement.geneExpression",
    "average.geneExpression",
    "fraction_detected.geneExpression",
    "add.features",
  ]

  useEffect(() => {
    if (userInstructions.length === 0) return;
    const latestResponse = userInstructions.slice(-1)[0].response;
    if(latestResponse) {
      if (intents.includes(latestResponse.intent)) {
          updatePlotState(latestResponse);
      } else if (latestResponse.intent === "celltypexorgan") {
          updateTable(latestResponse);
      }
    }
  }, [userInstructions]);

 
  // Generate and update plot according to user intends
  const updatePlotState = async (response) => {
    setTableData(null);
    let intent = response.intent;
    let generalIntent = intent.split(".")[0];
    let newPlotState = null;
    let average, fractions;
    let organism = response.params.organism;
    let organ = response.params.organ;
    let features = response.params.features;

    if (generalIntent === "add") {
        // update parameter for average/fraction plots
        features = plotState.features + "," + features.split(',');
        organism = plotState.organism;
        organ = plotState.organ;
        // check if add command is applied to average or fraction
        if(!plotState.data.fractions) {
            generalIntent = 'average';
        } else {
            generalIntent = 'fraction_detected';
        }
     }

    if (generalIntent === "markers") {
      console.log(response);
      // const markerFeatures = response.data.markers;
      let markerCelltype = response.params.celltype;
      let apiMarkers = await atlasapprox.markers(organism, organ, markerCelltype);
      features = apiMarkers.markers.join(',');
      generalIntent = 'fraction_detected';
    }
    
    let apiCelltypes = await atlasapprox.celltypes(organism, organ);
    let celltypes = apiCelltypes.celltypes;

    if (generalIntent === "average") {
        let apiResponse = await atlasapprox.average(organism, organ,features)
        average = apiResponse.average ? transpose(apiResponse.average) : null;
        
        let plotType = "heatmap";
        newPlotState = {
            intent,
            plotType,
            organism,
            organ,
            features,
            data: {
                type: "matrix",
                xaxis: celltypes,
                yaxis: features.split(","),
                average: average,
                fractions: null,
                valueUnit: "counts per ten thousand"
          }
        };
    } 

    if (generalIntent === "fraction_detected") {
        let apiFraction = await atlasapprox.fraction_detected(organism, organ, features);
        let apiAverage = await atlasapprox.average(organism, organ, features);
        fractions = apiFraction.fraction_detected ? transpose(apiFraction.fraction_detected) : null;
        average = apiAverage.average ? transpose(apiAverage.average) : null;
        // console.log(typeof(features));
        let plotType = "bubbleHeatmap";
        newPlotState = {
            intent,
            plotType,
            organism,
            organ,
            features,
            data: {
                type: "matrix",
                xaxis: celltypes,
                yaxis: features.split(","),
                average: average,
                fractions: fractions,
                valueUnit: "counts per ten thousand"
            }
        };
    }

    if (generalIntent === "highest_measurement") {
      const highestResponse = await atlasapprox.highest_measurement(organism, features, 10)
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
        features,
        data: {
          type: "matrix",
          xaxis: xaxis,
          yaxis: highestResponse.average,
          average: highestResponse.average,
          fractions: null,
          valueUnit: "counts per ten thousand"
        }
      };
    }

    console.log(newPlotState);
    setPlotState(newPlotState);
  };

  const updateTable = async(response) => {
    let organism = response.params.organism;
    let apiCellxOrgans = await atlasapprox.celltypexorgan(organism);
    let organs = apiCellxOrgans.organs;
    let detected = apiCellxOrgans.detected;
    let celltypes = apiCellxOrgans.celltypes;
    let newTableData = null;
    newTableData = {
      organism,
      organs,
      celltypes,
      detected,
    };
    setTableData(newTableData);
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
