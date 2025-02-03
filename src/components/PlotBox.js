import React from 'react';
import Heatmap from "./plots/Heatmap"
import BarChart from './plots/BarChart';
import HomologsGraph from './plots/HomologsGraph';
import Neighborhood from './plots/Neighborhood';
import BubbleHeatmap from './plots/BubbleHeatmap';
import OrganCellChart from './plots/OrganCellChart';
import TableOrganisms from './plots/TableOrganisms';
import CellxOrganTable from './plots/CellxOrganTable';
import OrganismProfile from './plots/OrganismProfile';
import FeatureSequences from './plots/FeatureSequences';
import CoexpressScatter from './plots/CoexpressScatter';
import CellTypeProfile from './plots/CellTypeProfile';
import HighestMeasurement from './plots/HighestMeasurement';
import HighestMeasurementMultiple from './plots/HighestMeasurementMultiple';
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
      )
    case 'fractionDetected':
    case 'fractionDetectedAcrossOrgans':
      return (
        <div style={plotStyle} id="plot-box">
          <BubbleHeatmap
            state={state}
          />
        </div>
      )
    case 'highestMeasurement':
      return (
        <div>
          <HighestMeasurement
            state={state}
          />
        </div>
      )
    case 'highestMeasurementMultiple':
      return (
        <div style={plotStyle}>
          <HighestMeasurementMultiple
            state={state}
          />
        </div>
      )
    case 'similarCelltypes':
      return (
        <div style={plotStyle}>
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
    case 'cellTypeProfile':
      return (
        <CellTypeProfile
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
    case 'coexpressScatter':
      return (
        <div style={plotStyle}>
          <CoexpressScatter 
            state={state}
          />
        </div>
      )
    case 'cellAbundance':
      return (
        <div style={plotStyle}>
          <OrganCellChart 
            state={state}
          />
        </div>
      )
    case 'homologs':
      return (
        <div style={plotStyle}>
          <HomologsGraph
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
