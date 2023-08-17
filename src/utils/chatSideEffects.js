import callAPI from "./callAPI.js";
import { buildAPIParams, buildAnswer } from './nlpHelpers.js';

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
    if (checkGenesIntents.includes(generalIntent)) {
      // check and remove invalid genes before generate plots

      let checkFeatures = await callAPI('has_features', params);
      let geneFound = [];
      let geneNotFound = [];
      checkFeatures.features.map((feature,index) => {
        checkFeatures.found[index] === true ? geneFound.push(feature) : geneNotFound.push(feature)  
      })
      
      // if none of the genes were valid
      if (geneFound.length < 1) {
        answer = `Oops! It looks like there are some invalid gene names in your input. Please ensure that human genes are written in ALL CAPITAL CASE (e.g., COL1A1), and for other species, use the appropriate capitalization (e.g., Col1a1)`;
        return {
          hasData: false,
          message: answer,
        }
      }

      // if there is at least one invalid gene
      if (geneNotFound.length > 0) {
        let geneNotFoundString = geneNotFound.join(', ');
        answer = `Removed invalid genes: ${geneNotFoundString}.`;
        params.features = params.features.split(',').filter(item => !geneNotFound.includes(item)).join(',');
      }

      // handle duplicate gene names in user input list
      params.features = [...new Set(params.features.split(','))].join(',');

      apiData = await callAPI(endpoint, params);
      answer += buildAnswer(intent, apiData);
    }

    else if (intent === "similar_features.geneExpression") {
      params['feature'] = params['features'];
      delete params['features'];
      apiData = await callAPI(endpoint, params);
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
