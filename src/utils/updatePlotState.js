import atlasapprox from "@fabilab/atlasapprox";
import transpose from "./math";

const exploreOrganism = (context) => {
    console.log(context);
    return {
        plotType: "organismProfile",
        organism: context.organism,
    };
};

const addGenes = async (context) => {
    // Extract required parameters from context within the function
    let features = `${context.plotState.features},${context.features}`;
    let mainIntent = context.plotState.mainIntent;
    let subIntent = context.plotState.subIntent;
    if (!context.plotState.data.fractions) {
        return await updateAverage({ ...context, features, mainIntent, subIntent });
    } else {
        return await updateFractions({ ...context, features });
    }
};

const removeGenes = async (context) => {
    let featuresToRemove = context.features.split(",").map(fea => fea.toLowerCase());
    let features = context.plotState.features.split(',').filter(g => !featuresToRemove.includes(g.toLowerCase())).join(',');

    if (!context.plotState.data.fractions) {
        return await updateAverage({ ...context, features });
    } else {
        return await updateFractions({ ...context, features });
    }
};

const toggleLog = async (context) => {
  
    let hasLog = !context.plotState.hasLog;
    const newPlotState = { ...context.plotState, hasLog };
    context.plotState = newPlotState;
    if (!context.plotState.data.fractions) {
        return await updateAverage(context);
    } else {
        return await updateFractions(context);
    }
};

const updateMarkers = async (context) => {
    console.log(context);
    let features = context.markers.join(",");
    return await updateFractions({ ...context, features });
};

const updateAverage = async (context) => {

    let apiResponse, xAxis;
    if (context.subIntent === 'chromatinAccessibility') {
        xAxis = context.response.data.celltypes;
    } else {
        if (context.dataCategory === "across_organs") {
            xAxis = context.response.data.organs;
            context.response.data.average = transpose(context.response.data.average);
        } else {
            xAxis = context.response.data.celltypes;
        }
    }

    return {
        intent: "average",
        // mainIntent: (context.mainIntent === 'add' || context.mainIntent === 'remove') ? context.plotState.mainIntent : context.mainIntent,
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
            yaxis: context.response.data.features,
            average: context.response.data.average,
            fractions: null,
            valueUnit: context.response.data.unit,
            measurementType: context.response.data.measurement_type,
        },
        hasLog: context.plotState.hasLog
    };
};

const updateFractions = async (context) => {
    console.log(context);
    let apiFraction, apiAverage, xAxis;
    if (context.dataCategory === "across_organs") {
        apiFraction = await atlasapprox.fraction_detected(context.organism, context.features, null, context.response.data.celltype, "gene_expression");
        xAxis = context.response.data.organs;
        context.response.data.average = transpose(context.response.data.average);
        apiFraction.fraction_detected = transpose(apiFraction.fraction_detected);
    } else {
        apiFraction = await atlasapprox.fraction_detected(context.organism, context.features, context.organ, null, "gene_expression");
        if (context.intent === 'similar_features.geneExpression' || context.intent === 'markers.geneExpression') {
            apiAverage = await atlasapprox.average(context.organism, context.features, context.organ, null, "gene_expression")
            context.response.data.average = apiAverage.average
            xAxis = apiAverage.celltypes;
        } else {
            xAxis = context.response.data.celltypes;
        }
    }

    console.log(xAxis);
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
            yaxis: apiFraction.features,
            average: context.response.data.average,
            fractions: apiFraction.fraction_detected,
            valueUnit: context.response.data.unit,
        },
        hasLog: context.plotState.hasLog
    };
};

const similarCelltypes = async (context) => {
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

const measureIntent = async (context) => {
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


const similarGenes = async (context) => {

    let similarFeatures = context.response.data.similar_features;
    similarFeatures.unshift(context.features);

    let updatedFeatures = [...new Set(similarFeatures)];
    let features = updatedFeatures.join(",");

    return await updateFractions({ ...context, features });
};


const cellsXorgans = async (context) => {

    return {
        plotType: "table",
        organism: context.organism,
        organs: context.response.data.organs,
        celltypes: context.response.data.celltypes,
        detected: context.response.data.detected
    };
};


const availaleOrganisms = async (context) => {
    let apiResponse;

    if (context.subIntent === 'chromatinAccessibility') {
        apiResponse = await atlasapprox.organisms("chromatin_accessibility");
    }

    let availaleOrganisms = null;

    if (apiResponse && apiResponse.organisms) {
        availaleOrganisms = apiResponse.organisms;
    }

    return {
        plotType: "showOrganisms",
        subIntent: context.subIntent,
        organisms: availaleOrganisms,
    };
};

const featureSequences = async(context) => {
    // let apiResponse = await atlasapprox.sequences(context.organism, context.features);
    return {
        plotType: "featureSequences",
        organism: context.organism,
        features: context.response.data.features,
        sequences: context.response.data.sequences,
        type: context.response.data.type,
    }
}


export const updatePlotState = async (response, plotState, setPlotState) => {
    console.log(response.data);
    console.log(response.params);
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
            newPlotState = await addGenes(context);
            break;
        case "remove":
            newPlotState = await removeGenes(context);
            break;
        case "plot":
            newPlotState = await toggleLog(context);
            break;
        case "markers":
            newPlotState = await updateMarkers(context);
            break;
        case "average":
            newPlotState = await updateAverage(context);
            break;
        case "fraction_detected":
            newPlotState = await updateFractions(context);
            break;
        case "highest_measurement":
            newPlotState = await measureIntent(context);
            break;
        case "similar_features":
            newPlotState = await similarGenes(context);
            break;
        case "celltypexorgan":
            newPlotState = await cellsXorgans(context);
            break;
        case "similar_celltypes":
            newPlotState = await similarCelltypes(context);
            break;
        case "organisms":
            newPlotState = await availaleOrganisms(context);
            break;
        case "feature_sequences":
            newPlotState = await featureSequences(context);
            break;
        default:
            break;
    }

    setPlotState(newPlotState);
};
