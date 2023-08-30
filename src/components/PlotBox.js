import React, { useRef } from 'react';
import Heatmap from "./plots/Heatmap"
import BubbleHeatmap from './plots/BubbleHeatmap';
import BarChart from './plots/BarChart';
import CellxOrganTable from './plots/CellxOrganTable';
import TableOrganisms from './plots/TableOrganisms';
import OrganismProfile from './plots/OrganismProfile';

const plotStyle = {
  marginTop: '5vh', 
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center'
}

// MainBoard.js has passed in the plotState as props
const PlotBox = ({ state }) => {
  if (state.plotType === 'heatmap') {
    return (
      <div style={plotStyle}>
        <Heatmap
          subIntent={state.subIntent}
          dataCategory={state.dataCategory}
          xaxis={state.data.xaxis}
          yaxis={state.data.yaxis}
          values={state.data.average}
          organism={state.organism}
          organ={state.organ}
          celltype={state.celltype}
          unit={state.data.valueUnit}
          measurementType={state.data.measurementType}
          hasLog={state.hasLog}
        />
      </div>
    );
  } else if (state.plotType === 'bubbleHeatmap') {
    return (
      <div id='canvasId' style={plotStyle}>
        <BubbleHeatmap
          target="canvasId"
          xaxis={state.data.xaxis}
          yaxis={state.data.yaxis}
          average={state.data.average}
          fractions={state.data.fractions}
          organism={state.organism}
          organ={state.organ}
          unit={state.data.valueUnit}
          hasLog={state.hasLog}
        />
      </div>
    );
  } else if (state.plotType === "barChart") {
    return (
      <div id='canvasId' style={plotStyle}>
        <BarChart
          intent={state.intent}
          celltypesOrgan={state.data.celltypesOrgan}
          targetCelltype={state.targetCelltype}
          average={state.data.average}
          organism={state.organism}
          features={state.features}
          unit={state.data.unit}
        />
      </div>
    )
  } else if (state.plotType === "table") {
    return (
      <CellxOrganTable
        state={state}
      />
    )
  } else if (state.plotType === "showOrganisms") {
    console.log(state.organisms);
    console.log(state.subIntent);
    return (
      <TableOrganisms
        subIntent={state.subIntent}
        organisms={state.organisms}
      />
    )
  } else if (state.plotType === 'organismProfile') {
    return (
      <div style={plotStyle}>
        <OrganismProfile
          organism={state.organism}
        />
      </div>
    )
  }
};

export default PlotBox;
