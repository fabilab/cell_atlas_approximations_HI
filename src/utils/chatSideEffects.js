import atlasapprox from "@fabilab/atlasapprox";
import callAPI from "./callAPI.js";
import { AtlasApproxNlp, buildAPIParams, buildAnswer } from '@fabilab/atlasapprox-nlp';

// Check if a/list of given genes exist in an specific organism/organs
export const filterGenes = async (genes, organism, organ) => {
  let availableGenes = await atlasapprox.features(organism, organ, "gene_expression");
  let result = { found: [], notFound: [] };

  for (let gene of genes) {
    if (availableGenes.features.includes(gene)) {
      if (! result.found.includes(gene)) {
        result.found.push(gene);
      }
    } else {
      result.notFound.push(gene);
    }
  }
  console.log(result);
  return result;
};

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
];

// check is all genes requested are found in our database
// check if the requested list of genes has duplications
const checkGenesIntents = [
	"average",
	"fraction_detected",
	"add",
	"remove",
]

export const triggersPlotUpdate = ((response) => {
    if (!response)
        return false;
    if (!response.hasData)
        return false;

    const generalIntent = response.intent.split(".")[0];
    return updatePlotIntents.includes(generalIntent);
});

export const updateChat = async (response,plotState) => {
    let entities = response.entities;
    let intent = response.intent;
    let complete = response.complete;
    let answer = "";
    let apiData;

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
    const { endpoint, params } = buildAPIParams(intent, entities);
    let generalIntent = intent.split(".")[0];
    let genesNotFound = '';
    // validate user input genes and handle error for some intends
    if (checkGenesIntents.includes(generalIntent)) {

      // for add and remove  gene intent, I need to get organ and organism from 
      // current plot State to validate new genes
      let organRequired = params.organ ||plotState.organ;
      let organismRequired = params.organism || plotState.organism;
      let filterOutput = await filterGenes(params.features.split(','),organismRequired, organRequired);
      console.log(filterOutput);
      if (filterOutput.found.length < 1) {
        answer = `Oops! It looks like there are some invalid gene names in your input. Please ensure that human genes are written in ALL CAPITAL CASE (e.g., COL1A1), and for other species, use the appropriate capitalization (e.g., Col1a1)`;
        return {
          hasData: false,
          message: answer,
        }
      }
      if (filterOutput.notFound.length > 0) {
        genesNotFound = filterOutput.notFound.filter(gene => params.features.includes(gene)).join(',');
        answer = genesNotFound === "" ? "" : `Removed invalid genes: ${genesNotFound}. `;
      }
      // move this line here to handle duplicate gene names
      console.log(params.features);
      params.features = [...new Set(params.features.split(','))].filter(gene => filterOutput.found.includes(gene)).join(',');
      console.log(params.features);
      apiData = await callAPI(endpoint, params);
      answer += buildAnswer(intent, apiData);
    }

    else if (intent === "similar_features.geneExpression") {
      params['feature'] = params['features'];
      delete params['features'];
      apiData = await callAPI(endpoint, params);
      // answer = buildAnswer(intent, apiData);
      answer += `Genes similar to ${params['feature']}: ${apiData['similar_features']}`;
    } 
    
    else if (intent === "highest_measurement.geneExpression") {
      console.log(params);
      params['feature'] = params['features'];
      params['number'] = '10';
      delete params['features'];
      apiData = await callAPI(endpoint, params);
      answer = buildAnswer(intent, apiData);
	  } 
  
    else {
      apiData = await callAPI(endpoint, params);
      answer += buildAnswer(intent, apiData);
    }

    return {
      hasData: true,
      params: params,
      data: apiData,
      message: answer,
    };
  };