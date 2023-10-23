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

const fetchFromAPI = () => {

}

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
  
  try {
    ({ endpoint, params } = buildAPIParams(intent, entities));

    console.log(params);
    if (mainIntent === "explore") {
      answer += `Fantastic choice! Check out the explore section on the right side of the page to dive deep into the world of ${params.organism} atlas`
      console.log(params);
      return {
        hasData: true,
        params: params,
        message: answer,
      };
    }

    // params and endpoint clean up:
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
    if (endpoint === 'markers' || endpoint === 'similar_features') {
      extraEndpointsToCall.push('average');
      extraEndpointsToCall.push('fraction_detected');
    } 
    
    if (endpoint === 'fraction_detected') {
      extraEndpointsToCall.push('average');
    }

    if (['add', 'remove'].includes(mainIntent)) {
      params['organism'] = plotState.organism; 
      params['organ'] = plotState.organ;

      if (plotState.data.fractions) {
        endpoint = 'fraction_detected';
        extraEndpointsToCall = ['average'];
      } else {
        endpoint = 'average'
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

    if (params.organ) {
      answer += `<br><br>It includes ${apiData.celltypes.length} cell types and ${apiData.features.length} genes.`
    }


    // for intent like "marker, fraction, similar celltypes"
    for (const e of extraEndpointsToCall) {
      if (endpoint === 'similar_features' || endpoint === 'markers') {
        params.features = [...apiData[endpoint]];
        endpoint === 'similar_features' && params.features.push(params.feature);
        delete params['celltype']
      }
      let extraApiData = await atlasapprox[e](params);
      apiData = {...apiData, ...extraApiData};
    }

  } catch ({ status, message, error }) {
      console.log(status, message, error);

      // invalid gene, we can auto remvoe it and re-call api
      if (error.type === 'invalid_parameter' && error[error.type] === 'features') {
        let invalid_gene_name_regex = new RegExp(`^(${Array.isArray(error.invalid_value) ? error.invalid_value.join('|') : error.invalid_value})$`, 'i');;
        
        params.features = params.features.split(',').filter(feature => !invalid_gene_name_regex.test(feature)).join(',');
        
        if (params.features.length !== 0) {
          apiData = await atlasapprox[endpoint](params);
          answer = 'Some invalid features are found, and they are auto-removed.<br><br>';
          answer += buildAnswer(intent, apiData);
          answer += `<br><br>It includes ${apiData.celltypes.length} cell types and ${apiData.features.length} genes.`
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

