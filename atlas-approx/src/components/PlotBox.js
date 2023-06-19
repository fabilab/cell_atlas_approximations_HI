import Heatmap from "./plots/Heatmap"

// MainBoard.js has passed in the plotState as props
const PlotBox = (props) => {

    if (props.state.plotType === 'heatmap') {
        return (
            <Heatmap
                target="canvas"
                xaxis={props.state.data.xaxis}
                yaxis={props.state.data.yaxis}
                values={props.state.data.values}
                organism={props.state.organism}
                organ={props.state.organ}
            />
        );
    } else if (props.state.plotType === 'dotplot') {
        return (<></>);
    } else {
        return <></>
    }
}

export default PlotBox