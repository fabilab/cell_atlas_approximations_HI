import transpose from "./plotHelpers.js/math";

const exploreOrganism = (context) => {
  let organism = context.organism;
  let organs = context.response.data.organs;
  let measurement_type = context.response.data.measurement_type;

  return {
    plotType: "organismProfile",
    organism: organism,
    organs: organs,
    measurement_type: measurement_type,
  };
};

const addFeatures = (context) => {
  let features = context.features;
  let measurement_type = context.plotState.measurement_type;
  if (context.plotState.plotType === "neighborhood") {
    return updateNeighbor(context);
  } else if (!context.plotState.fractions) {
    return updateAverage({ ...context, features, measurement_type });
  } else {
    return updateFractions({ ...context, features, measurement_type });
  }
};

const removeFeatures = (context) => {
  let features = context.features;
  if (context.plotState.plotType === "neighborhood") {
    return updateNeighbor(context);
  } else if (!context.plotState.fractions) {
    return updateAverage({ ...context, features });
  } else {
    return updateFractions({ ...context, features });
  }
};

const toggleLog = (context) => {
  context.plotState.hasLog = !context.plotState.hasLog;
  if (context.plotState.plotType === "neighborhood") {
    return updateNeighbor(context);
  } else if (context.plotState.plotType === "coexpressScatter") {
    return updateComeasurement(context);
  } else {
    if (!context.plotState.fractions) {
      return updateAverage(context);
    } else {
      return updateFractions(context);
    }
  }
};

const plotConversion = (context) => {
  const intentMap = {
    average: "fraction_detected.geneExpression",
    averageAcrossOrgans: "fraction_detected.geneExpression.across_organs",
    fractionDetected: "average.geneExpression",
    fractionDetectedAcrossOrgans: "average.geneExpression.across_organs",
  };

  let pt = context.plotState.plotType;
  let intent = intentMap[pt];
  if (!intent) return;

  if (pt.startsWith("average")) {
    return updateFractions({ ...context, intent });
  } else if (pt.startsWith("fractionDetected")) {
    return updateAverage({ ...context, intent });
  }
};

const updateMarkers = (context) => {
  if (context.markers.length === 0) {
    return;
  }
  let features = context.markers.join(",");
  return updateFractions({ ...context, features });
};

const updateInteractors = (context) => {
  return updateFractions({ ...context });
};

const updateHomologs = (context) => {
  let features, source_organism, target_organism, queries, targets, distances;
  features = context.response.params.features;
  source_organism = context.response.params.source_organism;
  target_organism = context.response.params.target_organism;
  queries = context.response.data.queries;
  targets = context.response.data.targets;
  distances = context.response.data.distances;

  return {
    plotType: "homologs",
    features: features,
    source_organism: source_organism,
    target_organism: target_organism,
    queries: queries,
    targets: targets,
    distances: distances,
  };
};

const updateAverage = (context) => {
  let xAxis, plotType, average, unit, yAxis, measurement_type;
  if (
    context.intent.split(".")[2] === "across_organs" ||
    (["add", "remove", "plot"].includes(context.intent.split(".")[0]) &&
      context.plotState.plotType.endsWith("AcrossOrgans"))
  ) {
    if (context.response.data) {
      xAxis = context.response.data.organs;
      average = transpose(context.response.data.average);
    } else {
      xAxis = context.plotState.xaxis;
      average = context.plotState.average;
    }
    plotType = "averageAcrossOrgans";
  } else {
    context.celltype = false;
    if (context.response.data) {
      xAxis = context.response.data.celltypes;
      average = context.response.data.average;
    } else {
      xAxis = context.plotState.xaxis;
      average = context.plotState.average;
    }
    plotType = "average";
  }

  if (context.response.data) {
    yAxis = context.response.data.features;
    unit = context.response.data.unit;
    measurement_type = context.response.data.measurement_type;
  } else {
    yAxis = context.plotState.yaxis;
    unit = context.plotState.unit;
    measurement_type = context.plotState.measurement_type;
  }

  return {
    plotType: plotType,
    organism: context.organism,
    organ: context.organ,
    features: context.features,
    celltype: context.celltype,
    xaxis: xAxis,
    yaxis: yAxis,
    average: average,
    fractions: null,
    unit: unit,
    measurement_type: measurement_type,
    hasLog: context.plotState.hasLog,
  };
};

const updateFractions = (context) => {
  let xAxis,
    plotType,
    average,
    fractions,
    unit,
    yAxis,
    measurement_type,
    queriedGenes,
    isSurface;
  if (
    context.intent.split(".")[2] === "across_organs" ||
    (["add", "remove", "plot"].includes(context.intent.split(".")[0]) &&
      context.plotState.plotType.endsWith("AcrossOrgans"))
  ) {
    if (context.response.data) {
      xAxis = context.response.data.organs;
      average = transpose(context.response.data.average);
      fractions = transpose(context.response.data.fraction_detected);
    } else {
      xAxis = context.plotState.xaxis;
      average = context.plotState.average;
      fractions = context.plotState.fractions;
    }
    plotType = "fractionDetectedAcrossOrgans";
  } else {
    context.celltype = false;
    if (context.response.data) {
      xAxis = context.response.data.celltypes;
      average = context.response.data.average;
      fractions = context.response.data.fraction_detected;
      isSurface = context.response.params.surface_only;
    } else {
      xAxis = context.plotState.xaxis;
      average = context.plotState.average;
      fractions = context.plotState.fractions;
      isSurface = context.plotState.isSurface;
    }
    plotType = "fractionDetected";
  }

  if (context.response.data) {
    yAxis = context.response.data.features;
    unit = context.response.data.unit;
    measurement_type = context.response.data.measurement_type;
    isSurface = context.response.params.surface_only;
  } else {
    yAxis = context.plotState.yaxis;
    unit = context.plotState.unit;
    measurement_type = context.plotState.measurement_type;
    isSurface = context.plotState.isSurface;
  }

  // handle 2 different cases:
  // apply log to an existing interactors plot
  // generate an interators plot with new gene sets from an old plot
  if (
    context.plotState.queriedGenes &&
    context.intent !== "interactors.geneExpression" &&
    context.intent === "plot.log"
  ) {
    queriedGenes = context.plotState.queriedGenes;
  } else if (context.intent === "interactors.geneExpression") {
    queriedGenes = [...new Set(context.response.data.queries)];
  }

  return {
    plotType: plotType,
    organism: context.organism,
    organ: context.organ,
    features: context.features,
    celltype: context.celltype,
    measurement_type: measurement_type,
    xaxis: xAxis,
    yaxis: yAxis,
    average: average,
    fractions: fractions,
    unit: unit,
    hasLog: context.plotState.hasLog,
    // This varibale is used only for interactor plots. we need these genes to highlight the plot
    queriedGenes: queriedGenes,
    isSurface: isSurface,
  };
};

const updateNeighbor = (context) => {
  let celltypes,
    nCells,
    boundaries,
    centroids,
    average,
    fractions,
    unit,
    measurement_type,
    queriedGenes;
  // by deault:
  if (context.response.data) {
    celltypes = context.response.data.celltypes;
    nCells = transpose(context.response.data.ncells);
    boundaries = context.response.data.boundaries;
    centroids = context.response.data.centroids;
    average = context.response.data.average;
    fractions = context.response.data.fraction_detected;
    unit = context.response.data.unit;
    measurement_type = context.response.data.measurement_type;
  }
  //  after appling log:
  else {
    celltypes = context.plotState.celltypes;
    nCells = context.plotState.nCells;
    boundaries = context.plotState.boundaries;
    centroids = context.plotState.centroids;
    average = context.plotState.average;
    fractions = context.plotState.fractions;
    unit = context.plotState.unit;
    measurement_type = context.plotState.measurement_type;
  }

  if (context.plotState.queriedGenes) {
    queriedGenes = context.plotState.queriedGenes;
  }

  return {
    plotType: "neighborhood",
    organism: context.organism,
    organ: context.organ,
    features: Array.isArray(context.features)
      ? context.features
      : context.features.split(","),
    celltypes: celltypes,
    nCells: nCells,
    boundaries: boundaries,
    centroids: centroids,
    average: average,
    fractions: fractions,
    hasLog: context.plotState.hasLog,
    unit: unit,
    measurement_type: measurement_type,
    queriedGenes: queriedGenes,
  };
};

const updateComeasurement = (context) => {
  let expData, unit, organs, by, features;
  // by deault:
  if (context.response.data) {
    expData = context.response.data.expData;
    unit = expData[0].unit;
    organs = context.response.data.organs;
    by = context.response.data.by;
    features = expData[0].features;
  }
  //  after applying log:
  else {
    expData = context.plotState.expData;
    unit = context.plotState.unit;
    organs = context.plotState.organs;
    by = context.plotState.by;
    features = expData[0].features;
  }

  features = Array.isArray(features) ? features : features.split(",");

  return {
    plotType: "coexpressScatter",
    organism: context.organism,
    features: features,
    expData: expData,
    unit: unit,
    hasLog: context.plotState.hasLog,
    organs: organs,
    by: by,
  };
};

const similarCelltypes = (context) => {
  let targetCelltype = context.response.params.celltype;
  let similarCelltypes = context.response.data.similar_celltypes;
  let similarOrgans = context.response.data.similar_organs;
  const celltypesOrgan = similarCelltypes?.map((c, index) => {
    return c + " (" + similarOrgans[index] + ")";
  });

  return {
    plotType: "similarCelltypes",
    targetCelltype: targetCelltype,
    organism: context.organism,
    organs: context.organs,
    celltypes: context.celltypes,
    features: context.features,
    measurement_type: context.measurement_type,
    celltypesOrgan: celltypesOrgan,
    yaxis: context.response.data.distances,
    average: context.response.data.distances,
    fractions: null,
    unit: context.response.data.unit,
  };
};

const highestMeasurement = (context) => {
  let organs = context.response.data.organs;
  let celltypes = context.response.data.celltypes;
  const celltypesOrgan = celltypes?.map((c, index) => {
    return c + " (" + organs[index] + ")";
  });

  return {
    plotType: "highestMeasurement",
    organism: context.organism,
    organs: organs,
    celltypes: celltypesOrgan,
    features: context.features,
    measurement_type: context.measurement_type,
    celltypesOrgan: celltypesOrgan,
    yaxis: context.response.data.average,
    average: context.response.data.average,
    fractions: null,
    unit: context.response.data.unit,
  };
};

const similarFeatures = (context) => {
  let features = context.features.join(",");
  return updateFractions({ ...context, features });
};

const cellXorgan = (context) => {
  return {
    plotType: "celltypeXorgan",
    organism: context.organism,
    organs: context.response.data.organs,
    celltypes: context.response.data.celltypes,
    detected: context.response.data.detected,
    measurement_type: context.measurement_type,
  };
};

const organXorganism = (context) => {
  return {
    plotType: "organXorganism",
    celltype: context.celltype,
    organs: context.response.data.organs,
    organisms: context.response.data.organisms,
    detected: context.response.data.detected,
    measurement_type: context.measurement_type,
  };
};

const cellAbundance = (context) => {
  return {
    plotType: "cellAbundance",
    plotLocation: "celltypes",
    organism: context.organism,
    apiCellOrgan: context.response.data,
    organName: context.organ,
    measurementType: context.response.data.measurement_type,
  };
};

const availableOrganisms = (context) => {
  return {
    plotType: "showOrganisms",
    organisms: context.response.data.organisms,
    measurement_type: context.measurement_type,
  };
};

const featureSequences = (context) => {
  return {
    plotType: "featureSequences",
    organism: context.organism,
    features: context.response.data.features,
    sequences: context.response.data.sequences,
    type: context.response.data.type,
    measurement_type: context.measurement_type,
  };
};

// This object dispatches single functions above based on intent
const plotFunctionDispatcher = {
  add: addFeatures,
  plot: toggleLog,
  remove: removeFeatures,
  explore: exploreOrganism,
  markers: updateMarkers,
  average: updateAverage,
  celltypes: cellAbundance,
  homologs: updateHomologs,
  organisms: availableOrganisms,
  convert_to: plotConversion,
  interactors: updateInteractors,
  neighborhood: updateNeighbor,
  comeasurement: updateComeasurement,
  organxorganism: organXorganism,
  celltypexorgan: cellXorgan,
  similar_features: similarFeatures,
  similar_celltypes: similarCelltypes,
  fraction_detected: updateFractions,
  feature_sequences: featureSequences,
  highest_measurement: highestMeasurement,
};

// Main "public" update plot state function
export const updatePlotState = (response, plotState, setPlotState) => {
  const intent = response.intent;
  const mainIntent = intent.split(".")[0];
  let newPlotState = null;
  if (plotState) {
    plotState.hasLog = plotState.hasLog || false;
  }
  const context = {
    intent: intent,
    features: response.data?.features || response.data?.feature || plotState.features,
    markers: (response.data && response.data.markers) || "",
    organism:
      (response.params && response.params.organism) ||
      (plotState && plotState.organism) ||
      "",
    organ:
      (response.params && response.params.organ) ||
      (plotState && plotState.organ) ||
      "",
    celltype:
      (response.params && response.params.celltype) ||
      (plotState && plotState.celltype) ||
      "",
    plotState: plotState,
    response: response,
    measurement_type: response.measurement_type || "",
  };

  const updateFunction = plotFunctionDispatcher[mainIntent];
  if (updateFunction) newPlotState = updateFunction(context);

  setPlotState(newPlotState);
};
