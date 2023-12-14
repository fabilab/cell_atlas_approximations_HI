import React from 'react';
import Heatmap from "./plots/Heatmap"
import BubbleHeatmap from './plots/BubbleHeatmap';
import BarChart from './plots/BarChart';
import CellxOrganTable from './plots/CellxOrganTable';
import TableOrganisms from './plots/TableOrganisms';
import OrganismProfile from './plots/OrganismProfile';
import FeatureSequences from './plots/FeatureSequences';
import Neighborhood from './plots/Neighborhood';
import OrganxOrganismTable from './plots/OrganxOrganismTable';

const plotStyle = {
  marginTop: '5vh', 
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center'
}

// MainBoard.js has passed in the plotState as props
const PlotBox = ({ state }) => {
  switch (state.plotType) {
    case 'average':
    case 'averageAcrossOrgans':
      return (
        <div style={plotStyle}>
          <Heatmap
            state={state}
          />
        </div>
      );
    case 'fractionDetected':
    case 'fractionDetectedAcrossOrgans':
      return (
        <div id='canvasId' style={plotStyle}>
          <BubbleHeatmap
            state={state}
          />
        </div>
      );
    case 'highestMeasurement':
    case 'similarCelltypes':
      return (
        <div id='canvasId' style={plotStyle}>
          <BarChart
            state={state}
          />
        </div>
      )
    case 'celltypeXorgan':
      return (
        <CellxOrganTable
          state={state}
        />
      )
    case 'organXorganism':
      return (
        <OrganxOrganismTable
          state={state}
        />
      )
    case "showOrganisms":
      return (
        <TableOrganisms
          state={state}
        />
      )
    case 'organismProfile':
      return (
        <div>
          <OrganismProfile
            state={state}
          />
        </div>
      )
    case 'featureSequences':
      return (
        <FeatureSequences
          state={state}
        />
      )
    case 'neighborhood':
      return (
        <div>
          <Neighborhood 
            state={state}
          />
        </div>
      )
    default:
      return (
        <div>
        </div>
      )
  }

};

export default PlotBox;
