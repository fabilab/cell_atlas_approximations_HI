import { buildAPIParams, buildAnswer } from './nlpHelpers.js';
import atlasapprox from "@fabilab/atlasapprox";
import { downloadFasta } from "./downloadFasta";

// decide if an NLP response triggers a plot update
const updatePlotIntents = [
  "markers",
  "highest_measurement",
  "average",
  "fraction_detected",
  "similar_features",
  "add",
  "remove",
  "celltypexorgan",
  "organisms",
  "similar_celltypes",
  "plot",
  "explore",
  "feature_sequences",
];

// check is all genes requested are found in our database
// check if the requested list of genes has duplications
const checkGenesIntents = [
	"average",
	"fraction_detected",
  "add",
]

export const triggersPlotUpdate = ((response) => {
  if (!response)
    return false;
  if (!response.hasData)
    return false;
  const mainIntent = response.intent.split(".")[0];
  return updatePlotIntents.includes(mainIntent);
});

export const updateChat = async (response, plotState) => {
  console.log(response);
  console.log(plotState);
  let entities = response.entities;
  let intent = response.intent;
  let mainIntent = intent.split('.')[0];
  let subIntent = intent.split('.')[1] || null;
  let complete = response.complete;
  let answer = "";
  let answer_extra = ""
  let apiData, averageExpressionData, endpoint, params;
  let extraEndpointsToCall = [];

  if (intent === "None") {
    return {
      hasData: false,
      message: "Sorry I didn't get that. Please rephrase.",
    };
  }

  if (!complete) {
    // forward the followup question to chatbox
    return {
      hasData: false,
      message: response.followUpQuestion,
    };
  }

  if (intent === "download") {
    if (!plotState) {
      return {
        message: "Sorry, there is no data to be downloaded"
      }
    } 
    try {
      downloadFasta(plotState)
      return {
        message: "Data has been downloaded successfully"
      }
    } catch (err) {
      console.error("Failed to download data ", err);
    }
  }

  
  try {
    ({ endpoint, params } = buildAPIParams(intent, entities));
    console.log(endpoint);

    if (endpoint === 'markers' || endpoint === 'similar_features') {
      extraEndpointsToCall.push('average');
      extraEndpointsToCall.push('fraction_detected');
    } else if (endpoint === 'fraction_detected') {
      extraEndpointsToCall.push('average');
    }

    if (checkGenesIntents.includes(mainIntent) && (subIntent === "geneExpression" || subIntent === "features")) {

      // check and remove invalid genes before generate plots
      // when intent is add gene, params = {features: 'newGene'}, we need to find a way to get the organism/organ, otherwise callAPI will fail
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
          const uniqueGenes = [...new Set([...params.features.split(','), ...plotStateGenes])];
          params.features = uniqueGenes.join(',');
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

    else if (intent === "average.chromatinAccessibility") {
      params['measurement_type'] = 'chromatin_accessibility';
    }

    else if (intent === "similar_features.geneExpression") {
      params['feature'] = params['features'];
      delete params['features'];
    } 
      
    else if (intent === "highest_measurement.geneExpression") {
      params['feature'] = params['features'];
      params['number'] = '10';
      delete params['features'];
    } 

    else if (intent === "highest_measurement.chromatinAccessibility") {
      params['feature'] = params['features'];
      params['number'] = '10';
      delete params['features'];
      params['measurement_type'] = 'chromatin_accessibility';
    }

    else if (intent === "organisms.chromatinAccessibility") {
      params['measurement_type'] = 'chromatin_accessibility';
    }

    else if (intent === "feature_sequences.geneExpression") {
      endpoint = "sequences";
    }

    apiData = await atlasapprox[endpoint](params);
    answer += buildAnswer(intent, apiData);
    if (answer_extra) {
      answer += answer_extra;
    }

    console.log(endpoint, extraEndpointsToCall)

    for (const e of extraEndpointsToCall) {
      // console.log(params);
      // console.log(e);
      if (endpoint === 'similar_features' || endpoint === 'markers') {
        params.features = [...apiData[endpoint]];
        endpoint === 'similar_features' && params.features.push(params.feature);
        delete params['celltype']
      }
      let extraApiData = await atlasapprox[e](params);
      // console.log(extraApiData);
      apiData = {...apiData, ...extraApiData};
    }

    // console.log(apiData)

  } catch ({ status, message, error }) {
      // console.error("An error occurred:");
      // console.log(status, message, error);
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

