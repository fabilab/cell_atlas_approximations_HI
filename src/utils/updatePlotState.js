import atlasapprox from "@fabilab/atlasapprox";
import transpose from "./math";

const exploreOrganism = (context) => {
    return {
        plotType: "organismProfile",
        organism: context.organism,
    };
};

const addGenes = (context) => {
    // Extract required parameters from context within the function
    let features = context.features;
    let mainIntent = context.plotState.mainIntent;
    let subIntent = context.plotState.subIntent;
    if (!context.plotState.data.fractions) {
        return updateAverage({ ...context, features, mainIntent, subIntent });
    } else {
        return updateFractions({ ...context, features });
    }
};

const removeGenes = (context) => {
    let features = context.features;
    if (!context.plotState.data.fractions) {
        return updateAverage({ ...context, features });
    } else {
        return updateFractions({ ...context, features });
    }
};

const toggleLog = (context) => {
    let hasLog = !context.plotState.hasLog;
    const newPlotState = { ...context.plotState, hasLog };
    context.plotState = newPlotState;
    if (!context.plotState.data.fractions) {
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

    let xAxis;
    if (context.subIntent === 'chromatinAccessibility') {
        xAxis = context.response.data.celltypes;
    } else {
        if (context.dataCategory === "across_organs") {
            xAxis = context.response.data.organs;
            context.response.data.average = transpose(context.response.data.average);
        } else {
            xAxis = context.response.data.celltypes || context.plotState.data.xaxis;
        }
    }
    let yAxis = context.response.data.features || context.plotState.data.yaxis; 
    let unit = context.response.data.unit || context.plotState.data.unit;
    return {
        intent: "average",
        mainIntent: context.mainIntent,
        subIntent: context.subIntent,
        dataCategory: context.dataCategory,
        plotType: "heatmap",
        organism: context.organism,
        organ: context.organ,
        features: context.features,
        celltype: context.response.params.celltype,
        data: {
            type: "matrix",
            xaxis: xAxis,
            yaxis: yAxis,
            average: context.response.data.average,
            fractions: null,
            unit: unit,
            measurementType: context.response.data.measurement_type,
        },
        hasLog: context.plotState.hasLog
    };
};

const updateFractions = (context) => {
    let xAxis;
    if (context.dataCategory === "across_organs") {
        context.response.data.average = transpose(context.response.data.average);
        context.response.data.fraction_detected = transpose(context.response.data.fraction_detected);
        xAxis = context.response.data.organs;
    } else {
        xAxis = context.response.data.celltypes || context.plotState.data.xaxis;
    }

    let yAxis = context.response.data.features || context.plotState.data.yaxis; 
    let fractions = context.response.data.fraction_detected || context.plotState.data.fractions;
    let average = context.response.data.average || context.plotState.data.average;
    let unit = context.response.data.unit || context.plotState.data.unit;
    
    return {
        intent: context.intent,
        plotType: "bubbleHeatmap",
        dataCategory: context.dataCategory,
        organism: context.organism,
        organ: context.organ,
        features: context.features,
        celltype: context.response.params.celltype,
        data: {
            type: "matrix",
            xaxis: xAxis,
            yaxis: yAxis,
            average: average,
            fractions: fractions,
            unit: unit,
        },
        hasLog: context.plotState.hasLog
    };
};

const updateNeighbor = (context) => {
    console.log(context);
    return {
        mainIntent: context.mainIntent,
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
        intent: context.intent,
        plotType: "barChart",
        targetCelltype: targetCelltype,
        organism: context.organism,
        organs: context.organs,
        celltypes: context.celltypes,
        features: context.features,
        data: {
            type: "matrix",
            celltypesOrgan: celltypesOrgan,
            yaxis: context.response.data.distances,
            average: context.response.data.distances,
            fractions: null,
            unit: context.response.data.unit
        }
    };
};

const measureIntent = (context) => {
    let organs = context.response.data.organs;
    let celltypes = context.response.data.celltypes;
    const celltypesOrgan = celltypes?.map((c, index) => {
        return c + " (" + organs[index] + ")";
    });

    return {
        intent: context.intent,
        plotType: "barChart",
        organism: context.organism,
        organs: organs,
        celltypes: celltypesOrgan,
        features: context.features,
        data: {
            type: "matrix",
            celltypesOrgan: celltypesOrgan,
            yaxis: context.response.data.average,
            average: context.response.data.average,
            fractions: null,
            unit: context.response.data.unit
        }
    };
};


const similarGenes = (context) => {

    let similarFeatures = context.response.data.similar_features;
    similarFeatures.unshift(context.features);

    let updatedFeatures = [...new Set(similarFeatures)];
    let features = updatedFeatures.join(",");

    return updateFractions({ ...context, features });
};


const cellsXorgans = (context) => {

    return {
        plotType: "table",
        organism: context.organism,
        organs: context.response.data.organs,
        celltypes: context.response.data.celltypes,
        detected: context.response.data.detected
    };
};


const availaleOrganisms = (context) => {

    let validSpecies = null;
    if (context.intent === "organisms.chromatinAccessibility") {
        validSpecies = context.response.data.organisms;
    }
    return {
        plotType: "showOrganisms",
        subIntent: context.subIntent,
        organisms: validSpecies,
    };
};

const featureSequences = (context) => {
    return {
        plotType: "featureSequences",
        organism: context.organism,
        features: context.response.data.features,
        sequences: context.response.data.sequences,
        type: context.response.data.type,
    }
}


export const updatePlotState = (response, plotState, setPlotState) => {
    console.log(response);
    let intent = response.intent;
    let mainIntent = intent.split(".")[0];
    let subIntent = intent.split(".")[1];
    let dataCategory = intent.split(".")[2] || "";
    let newPlotState = null;
    
    if (plotState) {
        plotState.hasLog = plotState.hasLog || false;
    }

    const context = {
      intent: intent,
      mainIntent: mainIntent,
      subIntent: subIntent,
      features: response.params.features || response.params.feature || plotState.features,
      markers: (response.data && response.data.markers) || "",
      organism: (response.params && response.params.organism) || (plotState && plotState.organism) || "",
      organ: (response.params && response.params.organ) || (plotState && plotState.organ) || "",
      dataCategory: dataCategory,
      plotState: plotState,
      response: response,
    };

    switch (mainIntent) {
        case "explore":
            newPlotState = exploreOrganism(context);
            break;
        case "add":
            newPlotState = addGenes(context);
            break;
        case "remove":
            newPlotState = removeGenes(context);
            break;
        case "plot":
            newPlotState = toggleLog(context);
            break;
        case "markers":
            newPlotState = updateMarkers(context);
            break;
        case "average":
            newPlotState = updateAverage(context);
            break;
        case "neighborhood":
            newPlotState = updateNeighbor(context);
            break;
        case "fraction_detected":
            newPlotState = updateFractions(context);
            break;
        case "highest_measurement":
            newPlotState = measureIntent(context);
            break;
        case "similar_features":
            newPlotState = similarGenes(context);
            break;
        case "celltypexorgan":
            newPlotState = cellsXorgans(context);
            break;
        case "similar_celltypes":
            newPlotState = similarCelltypes(context);
            break;
        case "organisms":
            newPlotState = availaleOrganisms(context);
            break;
        case "feature_sequences":
            newPlotState = featureSequences(context);
            break;
        default:
            break;
    }

    setPlotState(newPlotState);
};
