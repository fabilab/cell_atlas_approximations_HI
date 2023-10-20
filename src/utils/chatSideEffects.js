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
  console.log(response);
  console.log(plotState);
  let entities = response.entities;
  let intent = response.intent;
  let mainIntent = intent.split('.')[0];
  let subIntent = intent.split('.')[1] || null;
  let complete = response.complete;
  let answer = "", answer_extra = "", apiData, averageExpressionData, endpoint, params;
  let extraEndpointsToCall = [];
  console.log(mainIntent);
  console.log(subIntent);

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

    // params and endpoint clean up:
    if (subIntent === "chromatinAccessibility") {
      params['measurement_type'] = 'chromatin_accessibility';
    }

    if (mainIntent === "similar_features" || mainIntent === "highest_measurement") {
      params['feature'] = params['features'];
      delete params['features'];
    } 

    else if (intent === "feature_sequences.geneExpression") {
      endpoint = "sequences";
    }

    // for intents that without actual data, we need to make extra api calls
    if (endpoint === 'markers' || endpoint === 'similar_features') {
      extraEndpointsToCall.push('average');
      extraEndpointsToCall.push('fraction_detected');
    } else if (endpoint === 'fraction_detected') {
      extraEndpointsToCall.push('average');
    }

    // Feature validation
    if (checkGenesIntents.includes(mainIntent) && (subIntent === "geneExpression" || subIntent === "features")) {
      
      if (mainIntent === 'add') {
        params['organism'] = plotState.organism; 
        params['organ'] = plotState.organ;

        if (plotState.data.fractions) {
          endpoint = 'fraction_detected';
          extraEndpointsToCall = ['average'];
        } else {
          endpoint = 'average'
        }

        if (params.features && plotState.features) {
          const plotStateGenes = plotState.features.split(',').map(gene => gene.trim());
          params.features = [...new Set([...params.features.split(','), ...plotStateGenes])].join(',');
        }
      }

      else if (mainIntent === 'remove') {
        params['organism'] = plotState.organism; 
        params['organ'] = plotState.organ;

        if (plotState.data.fractions) {
          endpoint = 'fraction_detected';
          extraEndpointsToCall = ['average'];
        } else {
          endpoint = 'average'
        }

        if (params.features && plotState.features) {
          let geneArrayA = params.features.split(",");
          let geneArrayB = plotState.features.split(",");
          params.features = geneArrayB.filter(gene => !geneArrayA .includes(gene)).join(",");
        }
      } 

      if (params.organ) {
        let apiCelltypes = await atlasapprox.celltypes(params);
        let numCelltypes = apiCelltypes.celltypes.length;
        let numGenes = params.features.split(",").length;
        answer_extra += `<br><br>It includes ${numCelltypes} cell types and ${numGenes} genes.`
      }
    }
    
    else if (intent === "organisms.geneExpression") {
      let apiOrganisms = await atlasapprox.organisms("gene_expression");
      let numOrganisms = apiOrganisms.organisms.length;
      answer = `There are ${numOrganisms} organisms available:<br>`;
    }

    //  Finally, generate bot response and api data for the given intent
    apiData = await atlasapprox[endpoint](params);
    answer += buildAnswer(intent, apiData);
    if (answer_extra) {
      answer += answer_extra;
    }


    // for intent like "add and remove"
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
      // display the api error message to user
      console.log(status, message, error);
      return {
        hasData: false,
        message,
      };
  }

  return {
    hasData: true,
    params: params,
    data: apiData,
    message: answer,
  };
};

