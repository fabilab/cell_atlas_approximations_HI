import React, { useState, useEffect } from 'react';

import Heatmap from './plots/Heatmap';
import Api from "../Api";
import ChatBox from './ChatBox';
import PlotBox from './PlotBox';

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

    // run this function to update User's 
    useEffect(() => {
        async function parseUserInstruction() {

            const latestInstruction = userInstructions.slice(-2)[0];
            if (latestInstruction) {
                // console.log(`latest instruction is ${userInstructions.slice(-2)[0].message}`);
                const [organism, organ, featureString] = latestInstruction.message.split(',');
                const features = featureString.split(' ');

                const api = new Api();
                const result = await api.getAvgExpression(organism, organ, features);

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
        };
        parseUserInstruction();
    }, [userInstructions])

    return (
        <div className="columns mb-0 pb-0 has-background-light" style={{position:"absolute",height:"100%", width:"100%"}}>
            <div className="column is-4" style={{height:'inherit'}}>
                <ChatBox 
                    userInstructions={userInstructions}
                    setUserInstructions={(newSetOfInstructions) => setUserInstructions(newSetOfInstructions)} // if the user types in a new instruction, I need to be able to update it
                    context={{}}
                />
            </div>
            <div className="column is-8" id='canvas'>
                {
                    plotState.data.values.length !== 0 ?
                    <PlotBox
                        state={plotState}
                    />
                    :
                    <></>
                }
            </div>
        </div>
    )
}

export default MainBoard;
