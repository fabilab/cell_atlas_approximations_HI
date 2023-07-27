import atlasapprox from "@fabilab/atlasapprox";
import callAPI from "./callAPI.js";
import { AtlasApproxNlp, buildAPIParams, buildAnswer } from '@fabilab/atlasapprox-nlp';

// Check if a/list of given genes exist in an specific organism/organs
export const filterGenes = async (genes, organism, organ) => {
  console.log(genes);
  console.log(organism);
  console.log(organ);
  let availableGenes = await atlasapprox.features(organism, organ, "gene_expression");
  let result = { found: [], notFound: [] };

  for (let gene of genes) {
    if (availableGenes.features.includes(gene)) {
      result.found.push(gene);
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
    console.log(response);
    console.log("intent is " + intent);

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
    console.log(params);
    // validate user input genes and handle error for some intends
    if (checkGenesIntents.includes(generalIntent)) {

      // for add and remove  gene intent, I need to get organ and organism from 
      // current plot State to validate new genes
      let organRequired = params.organ ||plotState.organ;
      let organismRequired = params.organism || plotState.organism;
      let filterOutput = await filterGenes(params.features.split(','),organismRequired, organRequired);
      if (filterOutput.notFound.length > 0) {
        genesNotFound = filterOutput.notFound.filter(gene => params.features.includes(gene)).join(',');
        params.features = params.features.split(',').filter(gene => filterOutput.found.includes(gene)).join(',');
      }
    }
    let answer = genesNotFound === "" ? "" : `Removed invalid genes: ${genesNotFound}. `;
    let apiData;

    if (intent === "similar_features.geneExpression") {
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
    console.log(answer);
  }
  
    console.log(apiData);
    return {
      hasData: true,
      params: params,
      data: apiData,
      message: answer,
    };
  };