import React from 'react';
import Heatmap from "./plots/Heatmap"

// MainBoard.js has passed in the plotState as props
const PlotBox = ({ state }) => {
    if (state.plotType === 'heatmap') {
        console.log("checkin heatmap status: .data.values------");
        console.log(state.data.values)
        return (
            <Heatmap
                target="canvas"
                xaxis={state.data.xaxis}
                yaxis={state.data.yaxis}
                values={state.data.values}
                organism={state.organism}
                organ={state.organ}
            />
        );
    } else if (state.plotType === 'dotplot') {
        return (<></>);
    } else {
        console.log("No plot being generated")
        return <></>
    }

};

export default PlotBox
