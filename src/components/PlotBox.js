import React, { useState, forwardRef, useImperativeHandle } from 'react';
import Heatmap from "./plots/Heatmap"
import transpose from "../utils/math";

// MainBoard.js has passed in the plotState as props
const PlotBox = forwardRef((props, ref) => {
    
    // Initially "empty", so nothing is plotted (see the render return below)
    const [state, setState] = useState({
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
    })

    useImperativeHandle(ref, () => ({updateFromNLP: (response) => {
        (async () => {
            console.log("within async, response:");
            console.log(response);
            const organism = response.data.organism;
            const organ = response.data.organ;
            const features = response.data.features;
            const celltypes = await window.atlasapproxAPI("celltypes", { organism: organism, organ: organ });

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
                    values: matrix
                }
            }
            console.log("new plot state:");
            console.log(newPlotState);
            setState(newPlotState);
        })();
    }}), []);

    if (state.plotType === 'heatmap') {
        return (
            <Heatmap
                target="canvas"
                xaxis={state.data.xaxis}
                yaxis={state.data.yaxis}
                values={state.data.values}
                organism={state.organism}
            />
        );
    } else if (state.plotType === 'dotplot') {
        return (<></>);
    } else {
        return <></>
    }
})

export default PlotBox
