import atlasapprox from "atlasapprox";

function transpose(matrix) {
if (matrix.length === 0) {
    return matrix;
}
return matrix[0].map((col, c) => matrix.map((row, r) => matrix[r][c]));
}

export const updatePlotState = async (response, plotState, setPlotState) => {

let intent = response.intent;
let generalIntent = intent.split(".")[0];
let newPlotState = null;
let average, fractions;
let organism = response.params.organism || plotState.organism;
let organ = response.params.organ || plotState.organ;
let features = response.params.features;
let apiCelltypes = await atlasapprox.celltypes(organism, organ);
let celltypes = apiCelltypes.celltypes;

const addIntent = (() => {

    // update parameter for average/fraction plots
    features = plotState.features + "," + features.split(',');
    organism = plotState.organism;
    organ = plotState.organ;
    celltypes = plotState.celltypes;
    // check if add command is applied to average or fraction
    if(!plotState.data.fractions) {
        averageIntent();
    } else {
        fractionsIntent();
    }
});

const markersIntent = async () => {
    let markerCelltype = response.params.celltype;
    let apiMarkers = await atlasapprox.markers(organism, organ, markerCelltype);
    features = apiMarkers.markers.join(",");
    fractionsIntent();
};

const averageIntent = async () => {
    let apiResponse = await atlasapprox.average(organism, organ, features);
    average = apiResponse.average;
    let apiCelltypes = await atlasapprox.celltypes(organism, organ);
    let celltypes = apiCelltypes.celltypes;
    let plotType = "heatmap";
    newPlotState = {
      intent:"average",
      plotType,
      organism,
      organ,
      features,
      data: {
        type: "matrix",
        xaxis: celltypes,
        yaxis: features.split(","),
        average: average,
        fractions: null,
        valueUnit: "counts per ten thousand",
      },
    };
    console.log(newPlotState);
    setPlotState(newPlotState);
};

const fractionsIntent = async () => {
  let apiFraction = await atlasapprox.fraction_detected(organism, organ, features);
  let apiAverage = await atlasapprox.average(organism, organ, features);
  fractions = apiFraction.fraction_detected;
  average = apiAverage.average;
  let plotType = "bubbleHeatmap";

  newPlotState = {
    intent,
    plotType,
    organism,
    organ,
    features,
    data: {
      type: "matrix",
      xaxis: celltypes,
      yaxis: features.split(','),
      average: average,
      fractions: fractions,
      valueUnit: "counts per million",
    },
  };
  setPlotState(newPlotState);
};

const measureIntent = async () => {
    const highestResponse = await atlasapprox.highest_measurement(organism, features, 10);
    const plotType = "barChart";
    let organs = highestResponse.organs;
    let celltypes = highestResponse.celltypes;
    console.log(celltypes);
    const celltypesOrgan = celltypes.map((c, index) => {
      return c + " (" + organs[index] + ")";
    });
    newPlotState = {
      intent,
      plotType,
      organism,
      organs,
      celltypes,
      features,
      data: {
        type: "matrix",
        celltypesOrgan: celltypesOrgan,
        yaxis: highestResponse.average,
        average: highestResponse.average,
        fractions: null,
        valueUnit: "counts per ten thousand",
      },
    };
    setPlotState(newPlotState);
  };

const cellxorganIntent = async () => {

    const plotType = "table";
    let apiCellxOrgans = await atlasapprox.celltypexorgan(organism);
    console.log("testing====")
    console.log(apiCellxOrgans);
    let organs = apiCellxOrgans.organs;
    let detected = apiCellxOrgans.detected;
    let celltypes = apiCellxOrgans.celltypes;
    newPlotState = {
        plotType,
        organism,
        organs,
        celltypes,
        detected,
    }
    setPlotState(newPlotState);
};


switch (generalIntent) {
    case "add": 
        addIntent();
        break;
    case "markers":
        markersIntent();
        break;
    case "average":
        averageIntent();
        break;
    case "fraction_detected":
        fractionsIntent();
        break;
    case "highest_measurement":
        measureIntent();
        break;
    case "celltypexorgan":
        cellxorganIntent();
        break;
    default:
		console.log("default case")
      	break;
	}
};

