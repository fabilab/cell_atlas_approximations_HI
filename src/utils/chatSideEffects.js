import atlasapprox from "@fabilab/atlasapprox";
import { buildAPIParams, buildAnswer } from "./nlpResponseGenerator.js";
import { handleNoApiIntents } from "./chatHelper.js/hanleNoApiIntent.js";
import { handlePlotConversion } from "./chatHelper.js/plotConversion.js";
import { handleAddRemove } from "./chatHelper.js/addRemoveHandler.js";
import { handleErrors } from "./chatHelper.js/errorHandler.js"; 

// updatePlotIntents: An array of intents that trigger a plot update.
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

// mainIntentNotRequiresApi: An array of main intents that don't require an API call.
// These intents can be handled without fetching data from the API.
const mainIntentNotRequiresApi = ["greetings", "download", "plot"];

// triggersPlotUpdate: Checks if a response triggers a plot update.
// It verifies if the response contains data and if the main intent is included in the updatePlotIntents array.
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
    //  START: plot conversion
    const plotConversionResult = handlePlotConversion(mainIntent, subIntent, plotState, params);
    if (plotConversionResult) {
      if (plotConversionResult.message) {
        return plotConversionResult;
      } else {
        ({ intent, mainIntent, subIntent, params } = plotConversionResult);
      }
    }

    // END

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

    // for intents that without actual data, we need to make extra api calls
    if (mainIntent === "similar_features") {
      extraEndpointsToCall.push("dotplot");
    }

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

    if (
      intent === "zoom.in.neighborhood" &&
      ["fractionDetected", "average"].includes(plotState.plotType)
    ) {
      response.intent = intent = "neighborhood.geneExpression";
      mainIntent = endpoint = "neighborhood";
      params = {
        organ: plotState.organ,
        organism: plotState.organism,
        features: plotState.features,
        measurement_type: "gene_expression",
        include_embedding: true,
      };
    }

    if (mainIntent === "fraction_detected" || mainIntent === "average") {
      endpoint = "dotplot";
    }
    if (["add", "remove"].includes(mainIntent)) {
      const result = handleAddRemove(mainIntent, params, plotState, endpoint);
      params = result.params;
      endpoint = result.endpoint;
    }

    if (mainIntent === 'comeasurement') {
      endpoint = 'organs';
    }

    // when user already at co-rexpression analysis and want to zoom in/out, no need to call organs enpoint
    // just need to call extra endpoints
    if (plotState.plotType === 'coexpressScatter' && mainIntent === 'zoom') {
      endpoint = null
      if (intent === 'zoom.out.neighborhood') {
        response.intent = intent = 'comeasurement.geneExpression';
        mainIntent = 'comeasurement';
      }
    }

    // ------------------- START CALLING MAIN API ENDPOINT ------------------- //
    if (endpoint) {
      // all main end point call here
      apiData = await atlasapprox[endpoint](params);

      if (intent === "celltypes.geneExpression") {
        apiData.targetCelltypes = targetCelltypes;
        apiData.targetOrgan = targetOrgan;
      }

    }

    // ------------------- END CALLING MAIN API ENDPOINT ------------------- //
    
    // ------------------- START CALLING EXTRA ENPOINTS ------------------- //

    if (intent === "markers.geneExpression" || intent === "markers.chromatinAccessibility") {
      if (apiData.markers.length === 0) {
        answer = `There is no markers detected in ${apiData.organism} ${apiData.organ}`;
      } else {
          extraEndpointsToCall.push('dotplot');
      }
    }

    // for example, markers: the initial API call will give us a list of genes
    // but we still need to make another API call through the 'dotplot' endpoint to get data for plotting
    for (const e of extraEndpointsToCall) {

      if (mainIntent === 'similar_features' || mainIntent === 'markers') {
        params.features = [...apiData[endpoint]];
        endpoint === 'similar_features' && params.features.push(params.feature);
        delete params['celltype']
      }
      params.features = [...new Set(params.features)];
      let extraApiData = await atlasapprox[e](params);
      apiData = {...apiData, ...extraApiData};
    }

    // extra parallel API calls to fecth avg expression for each organ
    if (intent === 'zoom.in.neighborhood' && plotState.plotType === 'coexpressScatter') {
      const organs = plotState.organs;
      params.organism = plotState.organism;
      params.features = plotState.features;
      const averagePromises = organs.map(organ => {
        params.organ = organ;
        return atlasapprox['neighborhood'](params);
      })
      const expData = await Promise.all(averagePromises);
      response.intent = intent = 'comeasurement.geneExpression'
      apiData = {expData: expData, features: params.features, organism: params.organism, organs: organs, by: 'cellstate'}
    } 

    // extra parallel API calls to fecth avg expression for each organ
    if (mainIntent === 'comeasurement') {
      let organs = apiData?.organs;

      // user typing in zoom out without zooming in
      // or user type in a new coexpression query right after zooming out
      // or user zoom out after zooming in
      if (plotState?.by === 'cellstate' || plotState?.by === 'celltype') {
        organs = plotState.organs;
        
        // BUG FIXED: if this is another coexpression query on top of an existing coexpression query
        // we don't want to use the old params in the new query
        // so we only assign params a values when we are 'zooming out'
        if (Object.keys(params).length === 0) {
          params.features = plotState.features;
          params.organism = plotState.organism;
        }
      }
      const averagePromises = organs.map(organ => {
        params.organ = organ;
        return atlasapprox['average'](params);
      })
      const expData = await Promise.all(averagePromises);
      apiData = {expData: expData, features: params.features, organism: params.organism, organs: organs, by: 'celltype'}
    }

    // ------------------- END CALLING EXTRA ENPOINTS ------------------- //

    // ------------------- START BUILDING ANSWER WHEN MAIN API CALL SUCCEEDS ------------------- //

    if (intent === "organisms.geneExpression") {
      let numOrganisms = apiData.organisms.length;
      answer = `There are ${numOrganisms} organisms available:<br>`;
    } 

    answer += buildAnswer(intent, plotState, apiData);

    if (params.organ && apiData.celltypes && mainIntent !== "neighborhood") {
      answer += `<br><br>It includes ${apiData.celltypes.length} cell types and ${apiData.features.length} features.`
    }

    // ------------------- END BUILDING ANSWER WHEN MAIN API CALL SUCCEEDS ------------------- //
    
  } catch ({ status, message, error }) {
    const result = await handleErrors(error, mainIntent, params, entities, answer, endpoint, plotState, intent, message);
    params = result.params;
    apiData = result.apiData;
    answer = result.answer
  } finally {
    return {
      hasData: apiData !== null,
      params: apiData ? params : null,
      data: apiData || null,
      message: answer,
    };
  }
};
