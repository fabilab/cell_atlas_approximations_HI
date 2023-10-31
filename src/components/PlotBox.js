import React from 'react';
import Heatmap from "./plots/Heatmap"
import BubbleHeatmap from './plots/BubbleHeatmap';
import BarChart from './plots/BarChart';
import CellxOrganTable from './plots/CellxOrganTable';
import TableOrganisms from './plots/TableOrganisms';
import OrganismProfile from './plots/OrganismProfile';
import FeatureSequences from './plots/FeatureSequences';
import Neighborhood from './plots/Neighborhood';

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
          unit={state.data.unit}
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
          celltype={state.celltype}
          unit={state.data.unit}
          hasLog={state.hasLog}
          dataCategory={state.dataCategory}
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
    return (
      <TableOrganisms
        organisms={state.organisms}
      />
    )
  } else if (state.plotType === 'organismProfile') {
    return (
      <div>
        <OrganismProfile
          organism={state.organism}
        />
      </div>
    )
  } else if (state.plotType === 'featureSequences') {
    return (
      <FeatureSequences
        organism = {state.organism}
        features={state.features}
        sequences={state.sequences}
        type={state.type}
      />
    )
  } else if (state.plotType === 'neighborhood') {
    return (
      <div style={plotStyle}>
        <Neighborhood 
          mainIntent={state.mainIntent}
          organism={state.organism}
          organ={state.organ}
          features={state.features}
          celltypes={state.celltypes}
          nCells={state.nCells}
          boundaries={state.boundaries}
          centroids={state.centroids}
          average={state.average}
          fractions={state.fractions}
          hasLog={state.hasLog}
        />
      </div>
    )
    }
};

export default PlotBox;
