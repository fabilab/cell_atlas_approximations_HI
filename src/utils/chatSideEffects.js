import atlasapprox from "@fabilab/atlasapprox";
import { buildAPIParams, buildAnswer } from './nlpHelpers.js';
import { downloadFasta } from "./downloadFasta";

// decide if an NLP response triggers a plot update
const updatePlotIntents = [
  "add",
  "plot",
  "zoom",
  "remove",
  "explore",
  "average",
  "markers",
  "organisms",
  "neighborhood",
  "celltypexorgan",
  "similar_features",
  "feature_sequences",
  "fraction_detected",
  "similar_celltypes",
  "highest_measurement",
];


const mainIntentNotRequiresApi = [
  "download",
  "explore",
  "plot"
];

// Update the plot only when there is new data coming
export const triggersPlotUpdate = ((response) => {
  if (!response)
    return false;
  if (!response.hasData)
    return false;
  const mainIntent = response.intent.split(".")[0];
  return updatePlotIntents.includes(mainIntent);
});

// Generate bot response and get data
export const updateChat = async (response, plotState) => {
  let entities = response.entities;
  let intent = response.intent;
  let mainIntent = intent.split('.')[0];
  let subIntent = intent.split('.')[1] || null;
  let complete = response.complete;
  let answer = "", apiData = null, endpoint, params;
  let extraEndpointsToCall = [];

  // Intents that do not require API calls
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

  // Extract endpoint and parameters from the response
  ({ endpoint, params } = buildAPIParams(intent, entities));

  // If the intent does not require an API, just build the answer
  if (mainIntentNotRequiresApi.includes(mainIntent)) {
    switch (mainIntent) {
      case "download":
        let downloadAvailable = true;
        try {
          downloadFasta(plotState)
        } catch (err) {
          downloadAvailable = false;
        }
        answer = buildAnswer(intent, { success: downloadAvailable });
        return {
          message: answer,
        }
      case "explore":
        answer = buildAnswer(intent, { organism: params.organism });
        return {
          hasData: true,
          params: params,
          message: answer,
        };
      case "plot":
        answer = buildAnswer(intent);
        return {
          hasData: true,
          params: params,
          data: plotState.data,
          message: answer,
        };
      default:
        answer = buildAnswer(intent);
        return {
          message: answer,
        }
    }
  }

  // Intents that requires API calls & error handling
  try {
    if (subIntent === "chromatinAccessibility") { 
      params['measurement_type'] = 'chromatin_accessibility';
    }

    if (mainIntent === "similar_features" || mainIntent === "highest_measurement") {
      params['feature'] = params['features'];
      delete params['features'];
    } 
    
    if (intent === "feature_sequences.geneExpression") {
      endpoint = "sequences";
    }

    // for intents that without actual data, we need to make extra api calls
    if (mainIntent === 'markers' || mainIntent === 'similar_features') {
      extraEndpointsToCall.push('dotplot');
    } 

    if ((intent === 'zoom.out.neighborhood') && (plotState.plotType === 'neighborhood')) {
        // FIXME: figure out measurement type from plot state (needs some implementing)
        response.intent = intent = 'fraction_detected.geneExpression';
        mainIntent = "fraction_detected";
        params = {
          organ: plotState.organ,
          organism: plotState.organism,
          features: plotState.features,
          // FIXME: see above
          measurement_type: "gene_expression",
        };
    }

    if ((intent === 'zoom.in.neighborhood') && (['fractionDetected', 'average'].includes(plotState.plotType))) {
      // FIXME: figure out measurement type from plot state (needs some implementing)
      response.intent = intent = 'neighborhood.geneExpression';
      mainIntent = endpoint = "neighborhood";
      params = {
        organ: plotState.organ,
        organism: plotState.organism,
        features: plotState.features.join(","),
        // FIXME: see above
        measurement_type: "gene_expression",
      };
  }

    if (mainIntent === 'fraction_detected') {
      endpoint = "dotplot";
    }

    if (['add', 'remove'].includes(mainIntent)) {
      params['organism'] = plotState.organism; 

      if (plotState.plotType.endsWith("AcrossOrgans")) {
        params['celltype'] = plotState.celltype;
      } else {
        params['organ'] = plotState.organ;
      }

      if (plotState.plotType.startsWith("fraction")) {
        endpoint = "dotplot";
      } else {
        endpoint = 'average';
      }

      if (mainIntent === 'add' && params.features && plotState.features) {
        const plotStateGenes = plotState.features.split(',').map(gene => gene.trim());
        params.features = [...new Set([...params.features.split(','), ...plotStateGenes])].join(',');
      }

      if (mainIntent === 'remove' && params.features && plotState.features) {
        let geneArrayA = params.features.split(",");
        let geneArrayB = plotState.features.split(",");
        params.features = geneArrayB.filter(gene => !geneArrayA.includes(gene)).join(",");
      }

    }

    //  Finally, generate bot response and api data for the given intent
    apiData = await atlasapprox[endpoint](params);
  
    if (intent === "organisms.geneExpression") {
      let numOrganisms = apiData.organisms.length;
      answer = `There are ${numOrganisms} organisms available:<br>`;
    }
    answer += buildAnswer(intent, apiData);

    if (params.organ && apiData.celltypes && mainIntent !== "neighborhood") {
      answer += `<br><br>It includes ${apiData.celltypes.length} cell types and ${apiData.features.length} features.`
    }


    // for intent like "marker, fraction, similar celltypes"
    for (const e of extraEndpointsToCall) {
      if (mainIntent === 'similar_features' || mainIntent === 'markers') {
        params.features = [...apiData[endpoint]];
        endpoint === 'similar_features' && params.features.push(params.feature);
        delete params['celltype']
      }
      let extraApiData = await atlasapprox[e](params);
      apiData = {...apiData, ...extraApiData};
    }
    
  } catch ({ status, message, error }) {
      // invalid gene, we can auto remove it and re-call api
      let errorValue = error.invalid_value;
      let errorParam = error['invalid_parameter']
      if (error.type === 'invalid_parameter'){
        if (errorParam === 'features') {
          params.features = params.features.split(',').filter(feature => !errorValue.includes(feature.toLowerCase())).join(',');
        
          if (params.features.length !== 0) {
            apiData = await atlasapprox[endpoint](params);
            answer = `Invalid features detected: "${errorValue}". These have been automatically excluded<br><br>`;
            answer += buildAnswer(intent, apiData);
            answer += `<br><br>It covers ${apiData.celltypes.length} cell types and ${apiData.features.length} genes.`
          } else {
            answer = `I'm sorry, but the feature "${errorValue}" is not available in our current dataset for this query. Please specify a different feature.`;
          }
        } 
        else if (errorParam === 'feature') {
          answer += `I'm sorry, but the feature "${errorValue}" is not available in our current dataset for this query. Please specify a different feature.`;
        } else if (errorParam === 'organism') {
          answer += `I'm sorry, but the species "${errorValue}" is not available in our current dataset for this query. Please specify a different species.`;
        } else if (errorParam === 'organ') {
          answer += `I'm sorry, but the organ "${errorValue}" is not available in our current dataset for this query. Please specify a different organ.`;
        } 
        else if (errorParam === 'celltype') {
          answer += `I'm sorry, but the celltype "${errorValue}" is not available in our current dataset for this query. Please specify a different celltype.`;
        }
      } else {
        answer = message
      }

  } finally {
    return {
      hasData: apiData !== null,
      params: apiData ? params : null,
      data: apiData || null,
      message: answer,
    };
  }
};

