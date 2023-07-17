import atlasapprox from "atlasapprox";
import callAPI from "./callAPI.js";
import { isLabelWithInternallyDisabledControl } from "@testing-library/user-event/dist/utils/index.js";
// import atlasapprox from "atlasapprox";


// Check if a/list of given genes exist in an specific organism/organs
export const filterGenes = async (genes, organism, organ) => {
  let availableGenes = await atlasapprox.features(organism, organ);
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
    "add",
    "remove",
    "celltypexorgan",
    "organisms"
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


export const updateChat = async (response) => {
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

    const { endpoint, params } = window.buildAPIParams(intent, entities);
    let generalIntent = intent.split(".")[0];
    let genesNotFound = '';
    console.log(params);
    // validate user input genes and handle error for some intends
    if (checkGenesIntents.includes(generalIntent)) {
      let filterOutput = await filterGenes(params.features.split(','),params.organism,params.organ);
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
      // answer = window.buildAnswer(intent, apiData);
      answer = `Genes similar to ${params['feature']}: ${apiData['similar_features']}`;
    } else if (intent === "highest_measurement.geneExpression") {
		params['feature'] = params['features'];
		delete params['features'];
		// Need to give it a number
		params['number'] = "10";
		apiData = await callAPI(endpoint, params);
		answer = window.buildAnswer(intent, apiData);
	} else {
		apiData = await callAPI(endpoint, params);
		answer += window.buildAnswer(intent, apiData);
    }
    console.log(apiData);
    return {
      hasData: true,
      params: params,
      data: apiData,
      message: answer,
    };
  };