import atlasapprox from "@fabilab/atlasapprox";
import transpose from "./math";

export const updatePlotState = async (response, plotState, setPlotState) => {
  console.log(response);
  console.log("Updating plot !!!!=====");
  let intent = response.intent;
  let mainIntent = intent.split(".")[0];
  let subIntent = intent.split(".")[1];
  let dataCategory = intent.split(".")[2] || "";
  let newPlotState = null;
  let average, fractions;
  let organism = (response.params && response.params.organism) || (plotState && plotState.organism) || "";
  let organ = (response.params && response.params.organ) || (plotState && plotState.organ) || "";
  // For some intents, params have features instead of feature
  let features = response.params.features || response.params.feature;
  let apiCelltypes = await atlasapprox.celltypes(organism, organ);
  let celltypes = apiCelltypes.celltypes;
  let hasLog = plotState.hasLog;
  let plotType;

  const exploreOrganism = () => {
    plotType = "organismProfile";
    newPlotState = {
      plotType,
      organism,
    }
    setPlotState(newPlotState);
  };

  const addGenes = () => {
    
    // Update parameter for average/fraction plots
    features = plotState.features + "," + features;
    organism = plotState.organism;
    organ = plotState.organ;
    celltypes = plotState.data.xaxis;
    // add to a dotplot or heatmap?
    if (!plotState.data.fractions) {
      averageIntent();
    } else {
      fractionsIntent();
    }
  };

  const removeGenes = () => {

    let featuresLowerCase = features.split(",").map((fea) => (fea.toLowerCase()));
    features = plotState.features.split(',').filter(g => !featuresLowerCase.includes(g.toLowerCase())).join(',');
    organism = plotState.organism;
    organ = plotState.organ;
    celltypes = plotState.data.xaxis;
    // Check if add command is applied to average or fraction
    if (!plotState.data.fractions) {
      averageIntent();
    } else {
      fractionsIntent();
    }
  };

  const toggleLog = () => {
    hasLog = !hasLog;
    features = plotState.features;
    organism = plotState.organism;
    organ = plotState.organ;
    celltypes = plotState.data.xaxis;
    if (!plotState.data.fractions) {
      averageIntent();
    } else {
      fractionsIntent();
    }

  }
  const markersIntent = async () => {
    features = response.data.markers.join(",");
    fractionsIntent();
  };

  const averageIntent = async (subIntent, dataCategory) => {
    console.log(dataCategory);
    let apiResponse;
    let xAxis;
    if (subIntent === 'chromatinAccessibility') {
      apiResponse = await atlasapprox.average(organism, features, organ, null, "chromatin_accessibility");
      xAxis = apiResponse.celltypes;
    } else {
      if (dataCategory === "across_organs") {
        apiResponse = await atlasapprox.average(organism, features, null, response.params.celltype, "gene_expression");
        xAxis = apiResponse.organs;
        //  the data structure here is different from others, need to transpose x and y axis.
        apiResponse.average = transpose(apiResponse.average)
      } else {
        apiResponse = await atlasapprox.average(organism, features, organ, null, "gene_expression");
        xAxis = apiResponse.celltypes;
        console.log(apiResponse.average);
      }
    }
    console.log(response);
    plotType = "heatmap";
    newPlotState = {
      intent: "average",
      mainIntent,
      subIntent,
      dataCategory,
      plotType,
      organism,
      organ,
      features,
      celltype:response.params.celltype,
      data: {
        type: "matrix",
        xaxis: xAxis,
        yaxis: apiResponse.features,
        average: apiResponse.average,
        fractions: null,
        valueUnit: apiResponse.unit,
        measurementType: apiResponse.measurement_type,
      },
      hasLog: hasLog
    };
    setPlotState(newPlotState);
  };

  const fractionsIntent = async () => {
    let apiFraction = await atlasapprox.fraction_detected(organism, features, organ, null, "gene_expression")
    let apiAverage = await atlasapprox.average(organism, features, organ, null, "gene_expression");
    // let average_chromo = await atlasapprox.average(organism, features, organ, null, "chromatin_accessibility");

    fractions = apiFraction.fraction_detected;
    average = apiAverage.average;
    plotType = "bubbleHeatmap";

    newPlotState = {
      intent,
      plotType,
      organism,
      organ,
      features,
      data: {
        type: "matrix",
        xaxis: celltypes,
        yaxis: apiFraction.features,
        average: average,
        fractions: fractions,
        valueUnit: apiAverage.unit,
      },
      hasLog: hasLog
    };
    setPlotState(newPlotState);
  };

  const similarCelltypes = async () => {
    let targetCelltype = response.params.celltype;
    let nCelltypes = response.params.number;
    const apiSimilarCelltypes = await atlasapprox.similar_celltypes(organism, organ, targetCelltype, features, nCelltypes, "correlation");
    let similarCelltypes = apiSimilarCelltypes.similar_celltypes;
    let similarOrgans = apiSimilarCelltypes.similar_organs;
    const celltypesOrgan = similarCelltypes.map((c, index) => {
      return c + " (" + similarOrgans[index] + ")";
    });

    makeBarChart(targetCelltype, organ, celltypesOrgan, apiSimilarCelltypes.distances);
  }

  const measureIntent = async (subIntent) => {
    let apiResponse;
    if (subIntent === 'chromatinAccessibility') {
      apiResponse = await atlasapprox.highest_measurement(organism, features, 10, "chromatin_accessibility");
    } else {
      apiResponse = await atlasapprox.highest_measurement(organism, features, 10);
    }
    let organs = apiResponse.organs;
    let celltypes = apiResponse.celltypes;
    const celltypesOrgan = celltypes.map((c, index) => {
      return c + " (" + organs[index] + ")";
    });
    makeBarChart(null,organs, celltypesOrgan, apiResponse.average, apiResponse.unit);
  };


  function makeBarChart(targetCelltype,organs, xaxis, yaxis, unit) {

    plotType = "barChart";
    newPlotState = {
      intent,
      plotType,
      targetCelltype,
      organism,
      organs,
      celltypes,
      features,
      data: {
        type: "matrix",
        celltypesOrgan: xaxis,
        yaxis: yaxis,
        average: yaxis,
        fractions: null,
        unit: unit,
      },
    };
    setPlotState(newPlotState);
  }

  const similarGenes = async () => {
    // Generate a heatmap by default
    let similarFeatures = response.data.similar_features
    similarFeatures.unshift(features);
    features = similarFeatures.join(",");

    fractionsIntent();
  }

  const cellxorganIntent = async () => {
    plotType = "table";
    let apiOrgans = await atlasapprox.organs(organism, "gene_expression");
    let organs = apiOrgans.organs;
    let apiCellxOrgans = await atlasapprox.celltypexorgan(organism, organs, "gene_expression");
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

  const organismsIntent = async (subIntent) => {
    let apiResponse;
    if (subIntent === 'chromatinAccessibility') {
      apiResponse = await atlasapprox.organisms("chromatin_accessibility");
    } 
    console.log(apiResponse.organisms);
    plotType = "showOrganisms";
    newPlotState = {
      plotType,
      subIntent,
      organisms: apiResponse.organisms || null,
    }
    setPlotState(newPlotState);
  };

  switch (mainIntent) {
    case "explore":
      exploreOrganism();
      break;
    case "add":
      addGenes();
      break;
    case "remove":
      removeGenes();
      break;
    case "plot":
      toggleLog();
    break;
    case "markers":
      markersIntent();
      break;
    case "average":
      averageIntent(subIntent, dataCategory);
      break;
    case "fraction_detected":
      fractionsIntent();
      break;
    case "highest_measurement":
      measureIntent(subIntent);
      break;
    case "similar_features":
      similarGenes();
      break;
    case "celltypexorgan":
      cellxorganIntent();
      break;
    case "similar_celltypes":
      similarCelltypes();
      break;
    case "organisms":
      organismsIntent(subIntent);
			break;
    default:
      break;
  }
};
