import atlasapprox from "@fabilab/atlasapprox";
import transpose from "./math";

const exploreOrganism = (context) => {
    return {
        plotType: "organismProfile",
        organism: context.organism,
    };
};

const addGenes = async (context) => {
    // Extract required parameters from context within the function
    let features = `${context.plotState.features},${context.features}`;
    // const organism = context.plotState.organism;
    // const organ = context.plotState.organ;
    // const celltypes = context.plotState.data.xaxis;
    if (!context.plotState.data.fractions) {
        return await updateAverage({ ...context, features });
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
    let features = context.plotState.features;

    if (!context.plotState.data.fractions) {
        return await updateAverage({ ...context, features, hasLog });
    } else {
        return await updateFractions({ ...context, features, hasLog });
    }
};

const updateMarkers = async (context) => {
    let features = context.response.data.markers.join(",");
    return await updateFractions({ ...context, features });
};

const updateAverage = async (context) => {
    console.log(context);
    let apiResponse, xAxis;

    if (context.subIntent === 'chromatinAccessibility') {
        apiResponse = await atlasapprox.average(context.organism, context.features, context.organ, null, "chromatin_accessibility");
        xAxis = apiResponse.celltypes;
    } else {
        if (context.dataCategory === "across_organs") {
            apiResponse = await atlasapprox.average(context.organism, context.features, null, context.response.params.celltype, "gene_expression");
            xAxis = apiResponse.organs;
            apiResponse.average = transpose(apiResponse.average);
        } else {
            apiResponse = await atlasapprox.average(context.organism, context.features, context.organ, null, "gene_expression");
            xAxis = apiResponse.celltypes;
        }
    }

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
            yaxis: apiResponse.features,
            average: apiResponse.average,
            fractions: null,
            valueUnit: apiResponse.unit,
            measurementType: apiResponse.measurement_type,
        },
        hasLog: context.plotState.hasLog
    };
};

const updateFractions = async (context) => {
    const apiFraction = await atlasapprox.fraction_detected(context.organism, context.features, context.organ, null, "gene_expression");
    const apiAverage = await atlasapprox.average(context.organism, context.features, context.organ, null, "gene_expression");

    return {
        intent: context.intent,
        plotType: "bubbleHeatmap",
        organism: context.organism,
        organ: context.organ,
        features: context.features,
        data: {
            type: "matrix",
            xaxis: context.plotState.data.xaxis,  // Reuse existing celltypes from plotState
            yaxis: apiFraction.features,
            average: apiAverage.average,
            fractions: apiFraction.fraction_detected,
            valueUnit: apiAverage.unit,
        },
        hasLog: context.plotState.hasLog
    };
};

const similarCelltypes = async (context) => {
    let targetCelltype = context.response.params.celltype;
    let nCelltypes = context.response.params.number;
    const apiSimilarCelltypes = await atlasapprox.similar_celltypes(context.organism, context.organ, targetCelltype, context.features, nCelltypes, "correlation");
    let similarCelltypes = apiSimilarCelltypes.similar_celltypes;
    let similarOrgans = apiSimilarCelltypes.similar_organs;
    const celltypesOrgan = similarCelltypes.map((c, index) => {
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
            yaxis: apiSimilarCelltypes.distances,
            average: apiSimilarCelltypes.distances,
            fractions: null,
            unit: apiSimilarCelltypes.unit
        }
    };
};

const measureIntent = async (context) => {
    let apiResponse;
    if (context.subIntent === 'chromatinAccessibility') {
        apiResponse = await atlasapprox.highest_measurement(context.organism, context.features, 10, "chromatin_accessibility");
    } else {
        apiResponse = await atlasapprox.highest_measurement(context.organism, context.features, 10);
    }
    let organs = apiResponse.organs;
    let celltypes = apiResponse.celltypes;
    const celltypesOrgan = celltypes.map((c, index) => {
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
            yaxis: apiResponse.average,
            average: apiResponse.average,
            fractions: null,
            unit: apiResponse.unit
        }
    };
};


const similarGenes = async (context) => {
    let similarFeatures = context.response.data.similar_features;
    similarFeatures.unshift(context.features);
    let features = similarFeatures.join(",");

    return await updateFractions({ ...context, features });
};


const cellsXorgans = async (context) => {
    let apiOrgans = await atlasapprox.organs(context.organism, "gene_expression");
    let organs = apiOrgans.organs;
    let apiCellxOrgans = await atlasapprox.celltypexorgan(context.organism, organs, "gene_expression");

    return {
        plotType: "table",
        organism: context.organism,
        organs: organs,
        celltypes: apiCellxOrgans.celltypes,
        detected: apiCellxOrgans.detected
    };
};


const availaleOrganisms = async (context) => {
    let apiResponse;
    if (context.subIntent === 'chromatinAccessibility') {
        apiResponse = await atlasapprox.organisms("chromatin_accessibility");
    } 

    return {
        plotType: "showOrganisms",
        subIntent: context.subIntent,
        organisms: apiResponse.organisms || null
    };
};


export const updatePlotState = async (response, plotState, setPlotState) => {
    console.log(response);
    let intent = response.intent;
    let mainIntent = intent.split(".")[0];
    let subIntent = intent.split(".")[1];
    let dataCategory = intent.split(".")[2] || "";
    let newPlotState = null;

    const context = {
        features: response.params.features || response.params.feature,
        organism: (response.params && response.params.organism) || (plotState && plotState.organism) || "",
        organ: (response.params && response.params.organ) || (plotState && plotState.organ) || "",
        mainIntent: mainIntent,
        subIntent: subIntent,
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
        default:
            break;
    }

    setPlotState(newPlotState);
};
