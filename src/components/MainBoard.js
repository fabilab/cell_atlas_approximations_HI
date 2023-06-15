import React, { useRef, useState, useEffect } from 'react';

import ChatBox from './ChatBox';
import PlotBox from './PlotBox';
import transpose from "../utils/math";

function MainBoard() {

    const chatBox = useRef();
    const plotBox = useRef();
    const [stale, setStale] = useState(false);

    // run this function to update User's 
    useEffect(() => {
        if (!stale)
            return;

        async function updatePlot() {
            // If the NLP response has side-effects, i.e. carries data to be plotted, deal with them
            const latestResponse = chatBox.current.userInstructions.slice(-1)[0];
            const organism = latestResponse.organism;
            const organ = latestResponse.organ;
            const celltypes = await window.atlasapproxAPI("celltypes", { organism: organism, organ: organ });
            const features = latestResponse.features.split(",");
            let matrix;
            if (latestResponse.intent === "average")
                matrix = latestResponse.average;
            else if (latestResponse.intent === "fraction_detected")
                matrix = latestResponse.fractions;
            matrix = transpose(matrix);

            const newPlotState = {
                ...plotBox.current.state,
                organism,
                organ,
                features,
                data: {
                    ...plotBox.current.state.data, // ... = exact copy of this
                    type: "matrix",
                    xaxis: celltypes,
                    yaxis: features,
                    values: matrix
                }
            }
            
            plotBox.current.setState(newPlotState);
            setStale(false);
        }
        updatePlot();

    }, [stale])

    return (
        <div className="columns mb-0 pb-0 has-background-light" style={{position:"absolute",height:"100%", width:"100%"}}>
            <div className="column is-4" style={{height:'inherit'}}>
                <ChatBox 
                    ref={ chatBox }
                    setParentStale={() => setStale(true)}
                />
            </div>
            <div className="column is-8" id='canvas'>
                {
                <PlotBox
                    ref={ plotBox }
                />
                }
            </div>
        </div>
    )
}

export default MainBoard;
