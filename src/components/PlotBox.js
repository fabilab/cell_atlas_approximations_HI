import React from 'react';
import Heatmap from "./plots/Heatmap"
import BubbleHeatmap from './plots/BubbleHeatmap';
import BarChart from './plots/BarChart';

// MainBoard.js has passed in the plotState as props
const PlotBox = ({ state }) => {
    if (state.plotType === 'heatmap') {
        return (
            <Heatmap
                target="canvasId"
                xaxis={state.data.xaxis}
                yaxis={state.data.yaxis}
                values={state.data.average}
                organism={state.organism}
                organ={state.organ}
            />
        );
    } else if (state.plotType === 'bubbleHeatmap') {
        return (
            <BubbleHeatmap
                target="canvasId"
                xaxis={state.data.xaxis}
                yaxis={state.data.yaxis}
                average={state.data.average}
                fractions={state.data.fractions}
                organism={state.organism}
                organ={state.organ}
            />);
    } else if(state.plotType === "barChart") {
        console.log("State data average is =====!!!!")
        console.log(state.data.average);
        return (
            <BarChart
                target="canvasId"
                xaxis={state.data.xaxis}
                average={state.data.average}
                organism={state.organism}
                gene={state.gene}
            />);
    }
};

export default PlotBox
