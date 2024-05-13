import atlasapprox from "@fabilab/atlasapprox";
import {
  buildAPIParams,
  buildAnswer,
} from "./chatHelpers/nlpResponseGenerator.js";
import { handleNoApiIntents } from "./chatHelpers/handleNoApiIntent.js";
import { handlePlotConversion } from "./chatHelpers/plotConversion.js";
import { handleAddRemove } from "./chatHelpers/addRemoveHandler.js";
import { handleErrors } from "./chatHelpers/errorHandler.js";

// An array of intents that trigger a plot update.
// These intents require either fetching data from the API or from previous plot state, and updating the plot accordingly.
const updatePlotIntents = [
  "add",
  "plot",
  "zoom",
  "remove",
  "explore",
  "average",
  "markers",
  "celltypes",
  "organisms",
  "convert_to",
  "interactors",
  "neighborhood",
  "comeasurement",
  "celltypexorgan",
  "organxorganism",
  "similar_features",
  "feature_sequences",
  "fraction_detected",
  "similar_celltypes",
  "highest_measurement",
];

// An array of main intents that don't require an API call.
// These intents can be handled without fetching data from the API.
const mainIntentNotRequiresApi = ["greetings", "download", "plot"];

// Checks if a response triggers a plot update.
// Verifies if the response contains data and if the main intent is included in the updatePlotIntents array.
export const triggersPlotUpdate = (response) => {
  if (!response) return false;
  if (!response.hasData) return false;
  const mainIntent = response.intent.split(".")[0];
  return updatePlotIntents.includes(mainIntent);
};

/**
 * Generates bot responses and fetches data from the API based on the user's intent.
 * @param {object} response - Response returned by calling nlp.ask(user query)
 * @param {object} plotState - State of the current plot
 * @returns {object} - Object containing parameters extracted from user's query, data to make plot, and bot response
 */
export const updateChat = async (response, plotState) => {

  let entities = response.entities;
  let intent = response.intent;
  let mainIntent = intent.split(".")[0];
  let subIntent = intent.split(".")[1] || null;
  let complete = response.complete;
  let answer = "",
    apiData = null,
    endpoint,
    params;
  let extraEndpointsToCall = [];
  // this is defined to store celltypes and organ for celltypes intent.
  let targetCelltypes, targetOrgan;
  if (intent === "None") {
    return {
      hasData: false,
      message: "Sorry I didn't get that. Please rephrase.",
    };
  }

  // If incomplete, follow up question
  if (!complete) {
    return {
      hasData: false,
      message: response.followUpQuestion,
    };
  }

  // prepare the endpoint and parameters based on the user's intent and entities.
  // modifications might be necessary to ensure the API call functions correctly.
  ({ endpoint, params } = buildAPIParams(intent, entities));

  // If the intent does not require an API, just build the answer
  if (mainIntentNotRequiresApi.includes(mainIntent)) {
    return handleNoApiIntents(mainIntent, subIntent, intent, plotState, params);
  }

  // Intents that requires API calls & error handling
  try {
    //  START: Plot conversion
    const plotConversionResult = handlePlotConversion(
      mainIntent,
      subIntent,
      plotState,
      params
    );
    if (plotConversionResult) {
      if (plotConversionResult.message) {
        return plotConversionResult;
      } else {
        ({ intent, mainIntent, subIntent, params } = plotConversionResult);
      }
    }

    // END: Plot conversion

    // START: Adjustment of parameters to ensure correct API call
    if (mainIntent === "neighborhood") {
      params["include_embedding"] = true;
    }
    if (subIntent === "chromatinAccessibility") {
      params["measurement_type"] = "chromatin_accessibility";
    }

    if (
      mainIntent === "similar_features" ||
      mainIntent === "highest_measurement"
    ) {
      params["feature"] = params["features"];
      delete params["features"];
    }

    if (intent === "feature_sequences.geneExpression") {
      endpoint = "sequences";
    }

    if (intent === "celltypes.geneExpression") {
      let celltypesAPI = await atlasapprox[endpoint](params);
      targetCelltypes = celltypesAPI.celltypes;
      targetOrgan = celltypesAPI.organ;
      endpoint = "celltypexorgan";
    }

    // Handle intents without actual data requiring extra API calls
    if (mainIntent === "similar_features") {
      extraEndpointsToCall.push("dotplot");
    }

    // Handle interaction partners: we want to displat a dotplot containing both the queried and target genes
    if (mainIntent === "interactors") {
      endpoint = "interaction_partners";
      extraEndpointsToCall.push("dotplot");
    }

    // Handle exploration intents for different organism measurements
    if (intent === "explore.organism.geneExpression") {
      endpoint = "organs";
      params["measurement_type"] = "gene_expression";
    } else if (intent === "explore.organism.chromatinAccessibility") {
      endpoint = "organs";
      params["measurement_type"] = "chromatin_accessibility";
    }

    if (
      intent === "zoom.out.neighborhood" &&
      plotState.plotType === "neighborhood"
    ) {
      response.intent = intent = "fraction_detected.geneExpression";
      mainIntent = "fraction_detected";
      params = {
        organ: plotState.organ,
        organism: plotState.organism,
        features: plotState.features,
        measurement_type: "gene_expression",
        include_embedding: true,
      };
    }

    if (intent === "zoom.in.neighborhood") {
      if (["fractionDetected", "average"].includes(plotState.plotType)) {
        response.intent = intent = "neighborhood.geneExpression";
        mainIntent = endpoint = "neighborhood";
        params = {
          organ: plotState.organ,
          organism: plotState.organism,
          features: plotState.features,
          measurement_type: "gene_expression",
          include_embedding: true,
        };
      } else {
        answer +=
          "Zooming into the neighborhood is only supported for across cell types measurements, particularly for dotplot and heatmap visualizations";
      }
    }

    if (mainIntent === "fraction_detected" || mainIntent === "average") {
      endpoint = "dotplot";
    }

    if (["add", "remove"].includes(mainIntent)) {
      const result = handleAddRemove(mainIntent, params, plotState, endpoint);
      params = result.params;
      endpoint = result.endpoint;
    }

    if (mainIntent === "comeasurement") {
      endpoint = "organs";
    }

    if (intent === "markers.geneExpression.across_organs") {
      params["versus"] = "other_organs";
    }

    // when user already at co-rexpression analysis and want to zoom in/out, no need to call organs enpoint
    // just need to call extra endpoints
    if (plotState.plotType === "coexpressScatter" && mainIntent === "zoom") {
      endpoint = null;
      if (intent === "zoom.out.neighborhood") {
        response.intent = intent = "comeasurement.geneExpression";
        mainIntent = "comeasurement";
      }
    }
    // END parameter adjustment

    // START: Calling main API endpoint
    if (endpoint) {
      apiData = await atlasapprox[endpoint](params);

      if (intent === "celltypes.geneExpression") {
        apiData.targetCelltypes = targetCelltypes;
        apiData.targetOrgan = targetOrgan;
      }
    }

    // END: Calling main API endpoint

    // START: Calling extra endpoints
    if (
      intent === "markers.geneExpression" ||
      intent === "markers.chromatinAccessibility" ||
      intent === "markers.geneExpression.across_organs"
    ) {
      if (apiData.markers.length === 0) {
        answer = `There is no markers detected in ${apiData.organism} ${apiData.organ}`;
      } else {
        extraEndpointsToCall.push("dotplot");
      }
    }

    // handling case for when a gene has no interactor
    if (intent === "interactors.geneExpression") {
      
    }

    // Call extra endpoints for markers or similar features
    for (const e of extraEndpointsToCall) {
      if (mainIntent === "similar_features") {
        params.features = [...apiData[endpoint]];
        params.features.push(params.feature);
        delete params["celltype"];
      } else if (intent === "markers.geneExpression") {
        params.features = [...apiData[endpoint]];
        delete params["celltype"];
      } else if (intent === "markers.geneExpression.across_organs") {
        params.features = [...apiData[endpoint]];
        delete params["organ"];
      } else if (intent === "interactors.geneExpression"){
        // If there is no interactors partners being found, just return an answer
        if (apiData.targets.length === 0 || apiData.queries.length === 0) {
          apiData = null
          answer = "No interactors partners were found for the given query."
        } else {
          answer += buildAnswer(intent, plotState, apiData);

          const queryGenes = [...new Set(apiData.queries)];
          const targetGenes = apiData.targets;
          // group queried genes with their target genes
          const getAllGenes = (queries, targets) => {
            return queryGenes.reduce((acc, gene, index) => {
              acc.push(gene);
              const startIndex = queries.indexOf(gene);
              const endIndex = queries.lastIndexOf(gene);
              const targetSlice = targets.slice(startIndex, endIndex + 1);
              acc.push(...targetSlice);
              return acc;
            }, []);
          };
          const allGenes = getAllGenes(apiData.queries, targetGenes);
          params.features = [...new Set(allGenes)];
        }
      }
      params.features = [...new Set(params.features)];

      let extraApiData = await atlasapprox[e](params);
      apiData = { ...apiData, ...extraApiData };
    }

    // Call extra endpoints for zoom in neighborhood in coexpressScatter plot
    if (
      intent === "zoom.in.neighborhood" &&
      plotState.plotType === "coexpressScatter"
    ) {
      const organs = plotState.organs;
      params.organism = plotState.organism;
      params.features = plotState.features;
      const averagePromises = organs.map((organ) => {
        params.organ = organ;
        return atlasapprox["neighborhood"](params);
      });
      const expData = await Promise.all(averagePromises);
      response.intent = intent = "comeasurement.geneExpression";
      apiData = {
        expData: expData,
        features: params.features,
        organism: params.organism,
        organs: organs,
        by: "cellstate",
      };
    }

    // Call extra endpoints for comeasurement intent
    if (mainIntent === "comeasurement") {
      let organs = apiData?.organs;

      // user typing in zoom out without zooming in
      // or user type in a new coexpression query right after zooming out
      // or user zoom out after zooming in
      if (plotState?.by === "cellstate" || plotState?.by === "celltype") {
        organs = plotState.organs;

        // BUG FIXED: if this is another coexpression query on top of an existing coexpression query
        // we don't want to use the old params in the new query
        // so we only assign params a values when we are 'zooming out'
        if (Object.keys(params).length === 0) {
          params.features = plotState.features;
          params.organism = plotState.organism;
        }
      }
      const averagePromises = organs.map((organ) => {
        params.organ = organ;
        return atlasapprox["average"](params);
      });
      const expData = await Promise.all(averagePromises);
      apiData = {
        expData: expData,
        features: params.features,
        organism: params.organism,
        organs: organs,
        by: "celltype",
      };
    }

    // END: Calling extra endpoints

    // START: Handle building answer when main API call succeeds

    if (intent === "organisms.geneExpression") {
      let numOrganisms = apiData.organisms.length;
      answer = `There are ${numOrganisms} organisms available:<br>`;
    }

    answer += buildAnswer(intent, plotState, apiData);

    // if (params.organ && apiData.celltypes && mainIntent !== "neighborhood" && mainIntent != "interactors") {
    //   answer += `<br><br>It includes ${apiData.celltypes.length} cell types and ${apiData.features.length} features.`;
    // }

    // END: Handle building answer when main API call succeeds
  } catch ({ status, message, error }) {
    const result = await handleErrors(
      error,
      mainIntent,
      params,
      entities,
      answer,
      endpoint,
      plotState,
      intent,
      message,
      // this line is added to handle cases where there is an invalid gene found from the interactors api
      // which will cause an error on the dot plot api.
      // we need to pass both the queried and targets genes onto the dotplot's error handling function
      apiData 
    );
    params = result.params;
    apiData = result.apiData;
    answer = result.answer;
  } finally {
    return {
      hasData: apiData !== null,
      params: apiData ? params : null,
      data: apiData || null,
      message: answer,
    };
  }
};
