import React, { useState, useEffect } from 'react';
import { Layout, Breadcrumb, Divider, Card } from 'antd';

import Heatmap from './plots/Heatmap';
import Api from "../Api";
import ChatBox from './ChatBox';
import PlotBox from './PlotBox';
import Navbar from './Navbar';

import background from "../asset/background_4.jpg";
import QuickPlotGenerator from './QuickPlotGenerator';

const { Content } = Layout;


const MainBoard = () => {

    // / history of the chat (both the box and the user's message)
    const [userInstructions, setUserInstructions] = useState([]);
    
    const [plotData, setPlotData] = useState({
        // type: "matrix",
        // xaxis: [cell types],
        // yaxis: [gene1, gene2],
        // values: [[0, 1, 4, ...], [...]],
        // valueUnit: "counts per ten thousand",
        type: "", 
        xaxis: [],
        yaxis: [],
        values: [],
        valueUnit: "counts per ten thousand",
    })
    
    const [plotState, setPlotState] = useState({
        intent: "average",
        plotType: "heatmap",
        organism: "",
        organ: "",
        features: [],
        transforms: [],
        data: plotData
    })

    const [organismsPanel, setOrganismsPanel] = useState([]);

    useEffect(() => {
        async function fetchOrganismsPanel() {
            const api = new Api();
            const organismsResult = await api.getOrganisms();
            console.log("Testing here !!!!!!")
            console.log(organismsResult);

            setOrganismsPanel([...organismsResult]);
            console.log("type of organismsPanel is !! " + typeof(organismsPanel));
        }
        fetchOrganismsPanel();
    }, []);

    // run this function to update User's 
    useEffect(() => {
        async function parseUserInstruction() {

            const latestInstruction = userInstructions.slice(-2)[0];
            if (latestInstruction) {
                // console.log(`latest instruction is ${userInstructions.slice(-2)[0].message}`);
                const str = latestInstruction.message.replace(/(\r\n|\n|\r)/gm, "");
                const [organism, organ, featureString] = str.split(',');
                const features = featureString.split(' ');

                const api = new Api();
                const result = await api.getAvgExpression(organism, organ, features);

                // Source code: https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript
                function transpose(matrix) {
                    return matrix[0].map((col, c) => matrix.map((row, r) => matrix[r][c]));
                }

                const newPlotData = {
                    ...plotData, // ... = exact copy of this
                    type: "matrix",
                    xaxis: result.celltypes,
                    yaxis: result.features,
                    values: transpose(result.average)
                }

                const newPlotState = {
                    ...plotState,
                    organism,
                    organ,
                    features,
                    data: newPlotData
                }
                
                setPlotData(newPlotData);
                setPlotState(newPlotState);

            }
            console.log(userInstructions);
        };
        parseUserInstruction();
    }, [userInstructions])

    return (
        <Layout style={{minHeight: "100vh"}}>
            <ChatBox
                userInstructions={userInstructions}
                setUserInstructions={(newSetOfInstructions) => setUserInstructions(newSetOfInstructions)} // if the user types in a new instruction, I need to be able to update it
            />
            {/* <Layout style={{backgroundImage:`url(${background})`}}> */}
            <Layout style={{backgroundColor:"RGB(240,242,245)"}}>
                <Navbar/>
                <Content>
                    <QuickPlotGenerator
                        organisms={organismsPanel || []}
                    />
                    <Card 
                        id='canvas' 
                        style={{backgroundColor:'white', height: "70vh", margin:"2%"}}
                    >{
                        plotState.data.values.length !== 0 ?
                        <PlotBox
                            state={plotState}
                        />
                        :
                        <></>
                    }
                    </Card>
                </Content>
            </Layout>
        </Layout>
    )
}

export default MainBoard;
