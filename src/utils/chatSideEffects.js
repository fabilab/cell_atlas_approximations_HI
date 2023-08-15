import atlasapprox from "@fabilab/atlasapprox";
import callAPI from "./callAPI.js";
import { AtlasApproxNlp, buildAPIParams, buildAnswer } from '@fabilab/atlasapprox-nlp';

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
    console.log("Response is =====")
    console.log(response);

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
      // handle duplicate gene names in user input list
      params.features = [...new Set(params.features.split(','))].join(',');
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