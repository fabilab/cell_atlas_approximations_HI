import { buildAPIParams, buildAnswer } from './nlpHelpers.js';
import atlasapprox from "@fabilab/atlasapprox";
import { downloadFasta } from "./downloadFasta";

// decide if an NLP response triggers a plot update
const updatePlotIntents = [
  "add",
  "plot",
  "remove",
  "explore",
  "average",
  "markers",
  "organisms",
  "celltypexorgan",
  "similar_features",
  "feature_sequences",
  "fraction_detected",
  "similar_celltypes",
  "highest_measurement",
];

// check is all genes requested are found in our database
// check if the requested list of genes has duplications
const checkGenesIntents = [
	"average",
	"fraction_detected",
  "add",
  "remove",
]

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
  let answer = "", answer_extra = "", apiData = null, averageExpressionData, endpoint, params;
  let extraEndpointsToCall = [];

  ({ endpoint, params } = buildAPIParams(intent, entities));

  // Intents that do not require API calls
  if (intent === "None") {
    return {
      hasData: false,
      message: "Sorry I didn't get that. Please rephrase.",
    };
  }

  if (!complete) {
    return {
      hasData: false,
      message: response.followUpQuestion,
    };
  }

  if (intent === "download") {
    try {
      downloadFasta(plotState)
      return {
        message: "Data has been downloaded successfully."
      }
    } catch (err) {
      return {
        message: "Sorry, data is not available for download."
      }
    }
  }

  if (mainIntent === "explore") {
    answer += `Fantastic choice! Check out the explore section on the right side of the page to dive deep into the world of ${params.organism} atlas`
    return {
      hasData: true,
      params: params,
      message: answer,
    };
  }

  if (mainIntent === "plot") {
    answer += "Data modified as requested";
    return {
      hasData: true,
      params: params,
      data: plotState.data,
      message: answer,
    };
  }
  

  // Intents that requires api call & error handling
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
    
    if (mainIntent === 'fraction_detected') {
      endpoint = "dotplot";
    }

    if (['add', 'remove'].includes(mainIntent)) {
      params['organism'] = plotState.organism; 
      params['organ'] = plotState.organ;

      if (plotState.data.fractions) {
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
        params.features = geneArrayB.filter(gene => !geneArrayA .includes(gene)).join(",");
      }

    }

    //  Finally, generate bot response and api data for the given intent
    apiData = await atlasapprox[endpoint](params);
    
    if (intent === "organisms.geneExpression") {
      let numOrganisms = apiData.organisms.length;
      answer = `There are ${numOrganisms} organisms available:<br>`;
    }
    answer += buildAnswer(intent, apiData);

    if (params.organ && apiData.celltypes) {
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
      if (error.type === 'invalid_parameter' && (error.invalid_parameter === 'feature' || error.invalid_parameter === 'features')) {

        let invalid_genes = error.invalid_value;
        params.features = params.features.split(',').filter(feature => !invalid_genes.includes(feature.toLowerCase())).join(',');
        
        if (params.features.length !== 0) {
          apiData = await atlasapprox[endpoint](params);
          answer = `Invalid features detected: ${invalid_genes}. These have been automatically excluded<br><br>`;
          answer += buildAnswer(intent, apiData);
          answer += `<br><br>It covers ${apiData.celltypes.length} cell types and ${apiData.features.length} genes.`
        } else {
          answer = 'None of the features are valid. ';
        }
      
      // cannot recall api
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

