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
        return (
            <BarChart
                target="canvasId"
                xaxis={state.data.xaxis}
                average={state.data.average}
                organism={state.organism}
                gene={state.features}
            />);
    }
};

export default PlotBox
