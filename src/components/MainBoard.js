import React, { useState, useEffect } from 'react';
import { Layout, Card, Menu } from 'antd';

import ChatBox from './ChatBox';
import PlotBox from './PlotBox';
import Navbar from './Navbar';

import Landing from './Landing';
import Heatmap from './plots/Heatmap';

const { Content } = Layout;


const MainBoard = () => {

    const [userInstructions, setUserInstructions] = useState([]);
    // Initially "empty", so nothing is plotted (see the render return below)
    const [plotState, setPlotState] = useState({
        intent: "",
        plotType: "",
        organism: "",
        organ: "",
        features: [],
        transforms: [],
        data: {
            type: "", 
            xaxis: [],
            yaxis: [],
            values: [],
            valueUnit: "",
        },
    });

    // update plot upon new NLP instruction
    useEffect(() => {
        if (userInstructions.length === 0)
            return;
        const latestResponse = userInstructions.slice(-1)[0].response;
        if (latestResponse.plot)
            updatePlotState(latestResponse);
        return;
    }, [userInstructions]);

    const updatePlotState = (response) => {
        (async () => {
            console.log("within async, response:");
            console.log(response);
            const organism = response.data.organism;
            const organ = response.data.organ;
            const features = response.data.features;
            
            // !! Need to extract the celltypes field from the celltypes API response !!
            const celltypesResponse = await window.atlasapproxAPI(
                "celltypes", { organism: organism, organ: organ });
            const celltypes = celltypesResponse.celltypes;

            const intent = response.intent;
            const generalIntent = intent.split(".")[0];

            // Source code: https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript
            function transpose(matrix) {
                return matrix[0].map((col, c) => matrix.map((row, r) => matrix[r][c]));
            }
            let matrix;
            if (generalIntent === "average")
                matrix = response.data.average;
            else if (generalIntent === "fraction_detected")
                matrix = response.data.fractions;
            matrix = transpose(matrix);

            const plotType = "heatmap";
            const newPlotState = {
                intent,
                plotType,
                organism,
                organ,
                features,
                data: {
                    type: "matrix",
                    xaxis: celltypes,
                    yaxis: features,
                    values: matrix,
                    valueUnit: "counts per ten thousand"
                }
            }
            setPlotState(newPlotState);
        })();
    };

    return (
        <Layout style={{minHeight: "100vh"}}>
            <ChatBox
                userInstructions={ userInstructions }
                setUserInstructions={ (e) => setUserInstructions(e) }
            />

            <Layout style={{backgroundColor:"#fafafa"}}>
                <Navbar/>
                {plotState.data.values.length !== 0 &&
                    <Content>
                        <div style={{height:"5vh"}}></div>
                        <Card 
                            style={{backgroundColor:'white', height: "73vh", margin:"2%", marginTop:"0px"}}
                        >
                            <div id='canvas'>
                                <PlotBox
                                    state={ plotState }
                                />
                            </div>
                        </Card>
                    </Content>
                }
                {plotState.data.values.length === 0 &&
                    <Content
                        style={{margin:"30px", backgroundColor:"inherit"}}
                    >
                        <Landing/>
                    </Content>
                }
            </Layout>
        </Layout>
    )
}

export default MainBoard;
