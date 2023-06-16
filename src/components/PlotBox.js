import React from 'react';
import Heatmap from "./plots/Heatmap"

// MainBoard.js has passed in the plotState as props
const PlotBox = ({ state, setState }) => {
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
};

export default PlotBox
