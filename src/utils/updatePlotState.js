import transpose from "./math";

const exploreOrganism = (context) => {
    return {
        plotType: "organismProfile",
        organism: context.organism,
    };
};

const addFeatures = (context) => {
    // Extract required parameters from context within the function
    console.log(context);
    let features = context.features;
    let measurement_type = context.plotState.measurement_type;
    if (!context.plotState.fractions) {
        return updateAverage({ ...context, features, measurement_type });
    } else {
        return updateFractions({ ...context, features, measurement_type });
    }
};

const removeFeatures = (context) => {
    let features = context.features;
    if (!context.plotState.fractions) {
        return updateAverage({ ...context, features });
    } else {
        return updateFractions({ ...context, features });
    }
};

const toggleLog = (context) => {
    context.plotState.hasLog = !context.plotState.hasLog;
    console.log(context);
    if (!context.plotState.fractions) {
        return updateAverage(context);
    } else {
        return updateFractions(context);
    }
};

const updateMarkers = (context) => {
    let features = context.markers.join(",");
    return updateFractions({ ...context, features });

};

const updateAverage = (context) => {
    let xAxis, plotType, average, unit, yAxis, measurement_type, celltype;
    if (context.intent.split('.')[2] === "across_organs" || ((["add", "remove"].includes(context.intent.split('.')[0]) || context.intent === 'plot.log') && context.plotState.plotType.endsWith("AcrossOrgans"))) {
        if (context.response.data) {
          xAxis = context.response.data.organs;
          average = transpose(context.response.data.average);
          celltype = context.response.params.celltype;
        } else {
          xAxis = context.plotState.xaxis;
          average = context.plotState.average;
          celltype = context.plotState.celltype;
        }
        plotType = "averageAcrossOrgans";
    } else {
        if (context.response.data) {
          xAxis = context.response.data.celltypes;
          average = context.response.data.average;
          celltype = context.response.params.celltype;
        } else {
          xAxis = context.plotState.xaxis;
          average = context.plotState.average;
          celltype = context.plotState.celltype;
        }
        plotType = "average";
    }

    if (context.response.data) {
      yAxis = context.response.data.features; 
      unit = context.response.data.unit;
      measurement_type = context.response.data.measurement_type;
      celltype = context.response.params.celltype;
    } else {
      yAxis = context.plotState.yaxis; 
      unit = context.plotState.unit;
      measurement_type = context.plotState.measurement_type;
      celltype = context.plotState.celltype;
    }

    return {
        measurement_type: context.measurement_type,
        plotType: plotType,
        organism: context.organism,
        organ: context.organ,
        features: context.features,
        celltype: celltype,
        xaxis: xAxis,
        yaxis: yAxis,
        average: average,
        fractions: null,
        unit: unit,
        measurement_type: measurement_type,
        hasLog: context.plotState.hasLog
    };
};

const updateFractions = (context) => {
    let xAxis, plotType, average, fractions, unit, yAxis, measurement_type, celltype;
    if (context.intent.split('.')[2] === "across_organs" || ((["add", "remove"].includes(context.intent.split('.')[0]) || context.intent === 'plot.log') && context.plotState.plotType.endsWith("AcrossOrgans"))) {
        if (context.response.data) {
          xAxis = context.response.data.organs;
          average = transpose(context.response.data.average);
          fractions = transpose(context.response.data.fraction_detected);
          celltype = context.response.params.celltype;
        } else {
          xAxis = context.plotState.xaxis;
          average = context.plotState.average;
          fractions = context.plotState.fractions;
          celltype = context.plotState.celltype;
        }
        plotType = "fractionDetectedAcrossOrgans";
    } else {
        if (context.response.data) {
          xAxis = context.response.data.celltypes;
          average = context.response.data.average;
          fractions = context.response.data.fraction_detected;
          celltype = context.response.params.celltype;
        } else {
          xAxis = context.plotState.xaxis;
          average = context.plotState.average;
          fractions = context.plotState.fractions;
          celltype = context.plotState.celltype;
        }
        plotType = "fractionDetected";
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
        celltype: celltype,
        measurement_type: context.measurement_type,
        xaxis: xAxis,
        yaxis: yAxis,
        average: average,
        fractions: fractions,
        unit: unit,
        hasLog: context.plotState.hasLog
    };
};

const updateNeighbor = (context) => {
    return {
        plotType: "neighborhood",
        organism: context.organism,
        organ: context.organ,
        features: context.features.split(","),
        celltypes: context.response.data.celltypes,
        nCells: transpose(context.response.data.ncells),
        boundaries: context.response.data.boundaries,
        centroids: context.response.data.centroids,
        average: context.response.data.average,
        fractions: context.response.data.fraction_detected,
        hasLog: context.plotState.hasLog,
        unit: context.response.data.unit,
        measurement_type: context.measurement_type,
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
        unit: context.response.data.unit
    };
};


const similarFeatures = (context) => {
    let similarFeatures = context.response.data.similar_features;
    similarFeatures.unshift(context.features);

    let updatedFeatures = [...new Set(similarFeatures)];
    let features = updatedFeatures.join(",");

    return updateFractions({ ...context, features });
};


const cellsXorgans = (context) => {
    return {
        plotType: "celltypesXOrgans",
        organism: context.organism,
        organs: context.response.data.organs,
        celltypes: context.response.data.celltypes,
        detected: context.response.data.detected,
        measurement_type: context.measurement_type,
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
    }
}

// This object dispatches single functions above based on intent
const plotFunctionDispatcher = {
  "explore": exploreOrganism,
  "add": addFeatures,
  "remove": removeFeatures,
  "plot": toggleLog,
  "markers": updateMarkers,
  "average": updateAverage,
  "neighborhood": updateNeighbor,
  "fraction_detected": updateFractions,
  "highest_measurement": highestMeasurement,
  "similar_features": similarFeatures,
  "celltypexorgan": cellsXorgans,
  "similar_celltypes": similarCelltypes,
  "organisms": availableOrganisms,
  "feature_sequences": featureSequences,
};


// Main "public" update plot state function
export const updatePlotState = (response, plotState, setPlotState) => {
  const intent = response.intent;
  const mainIntent = intent.split('.')[0];
  
  let newPlotState = null;
  if (plotState) {
    plotState.hasLog = plotState.hasLog || false;
  }

  const context = {
    intent: intent,
    features: response.params.features || response.params.feature || plotState.features,
    markers: (response.data && response.data.markers) || "",
    organism: (response.params && response.params.organism) || (plotState && plotState.organism) || "",
    organ: (response.params && response.params.organ) || (plotState && plotState.organ) || "",
    plotState: plotState,
    response: response,
    measurement_type: response.measurement_type || "",
  };


  const updateFunction = plotFunctionDispatcher[mainIntent];
  if (updateFunction)
    newPlotState = updateFunction(context);

  setPlotState(newPlotState);
};
