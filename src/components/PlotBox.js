import React from 'react';
import Heatmap from "./plots/Heatmap"
import BubbleHeatmap from './plots/BubbleHeatmap';
import BarChart from './plots/BarChart';
import CellxOrganTable from './plots/CellxOrganTable';
import TableOrganisms from './plots/TableOrganisms';

// MainBoard.js has passed in the plotState as props
const PlotBox = ({ state }) => {
  if (state.plotType === 'heatmap') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Heatmap
          xaxis={state.data.xaxis}
          yaxis={state.data.yaxis}
          values={state.data.average}
          organism={state.organism}
          organ={state.organ}
        />
      </div>
    );
  } else if (state.plotType === 'bubbleHeatmap') {
    return (
      <div id='canvasId' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <BubbleHeatmap
          target="canvasId"
          xaxis={state.data.xaxis}
          yaxis={state.data.yaxis}
          average={state.data.average}
          fractions={state.data.fractions}
          organism={state.organism}
          organ={state.organ}
        />
      </div>
    );
  } else if (state.plotType === "barChart") {
    return (
      <div id='canvasId' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <BarChart
          intent={state.intent}
          celltypesOrgan={state.data.celltypesOrgan}
          targetCelltype={state.celltype}
          average={state.data.average}
          organism={state.organism}
          features={state.features}
        />
      </div>
    );
  } else if (state.plotType === "table") {
    return (
      <CellxOrganTable
        state={state}
      />
    )
  } else if (state.plotType === "showOrganisms") {
    return (
      <TableOrganisms
        state={state}
      />
    )
  }
};

export default PlotBox;
