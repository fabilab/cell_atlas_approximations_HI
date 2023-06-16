import React, { useState, useEffect } from 'react';

import ChatBox from './ChatBox';
import PlotBox from './PlotBox';
import transpose from "../utils/math";

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
            const celltypes = await window.atlasapproxAPI(
                "celltypes", { organism: organism, organ: organ });

            const intent = response.intent;
            const generalIntent = intent.split(".")[0];

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
            console.log("new plot state:");
            console.log(newPlotState);
            setPlotState(newPlotState);
        })();
    };

    return (
        <div className="columns mb-0 pb-0 has-background-light" style={{position:"absolute",height:"100%", width:"100%"}}>
            <div className="column is-4" style={{height:'inherit'}}>
                <ChatBox 
                    userInstructions={ userInstructions }
                    setUserInstructions={ setUserInstructions }
                />
            </div>
            <div className="column is-8" id='canvas'>
                {
                <PlotBox
                    state={ plotState }
                    setState={ setPlotState }
                />
                }
            </div>
        </div>
    )
};

export default MainBoard;
