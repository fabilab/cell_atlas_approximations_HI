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
  let apiData, endpoint, params;

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
    if (checkGenesIntents.includes(mainIntent) && (subIntent === "geneExpression" || subIntent === "features")) {

      // check and remove invalid genes before generate plots
      // when intent is add gene, params = {features: 'newGene'}, we need to find a way to get the organism/organ, otherwise callAPI will fail
      if (mainIntent === 'add') {
        params['organism'] = plotState.organism; 
        params['organ'] = plotState.organ;
        console.log(plotState);

        if (params.features && plotState.features) {
          const plotStateGenes = plotState.features.split(',').map(gene => gene.trim());
          const uniqueGenes = [...new Set([...params.features.split(','), ...plotStateGenes])];
          params.features = uniqueGenes.join(',');
        }
        console.log(params);
      }

      if (params.organ) {
        let apiCelltypes = await atlasapprox.celltypes(params.organism, params.organ);
        let numCelltypes = apiCelltypes.celltypes.length;
        let numGenes = params.features.split(",").length;
        apiData = await atlasapprox.average(params.organism, params.features, params.organ, null);

        answer += buildAnswer(intent, apiData);
        answer += `<br><br>It includes ${numCelltypes} cell types and ${numGenes} genes.`
      }

      // average exp across organs
      else {
        apiData = await atlasapprox.average(params.organism, params.features, null, params.celltype);
        answer += buildAnswer(intent, apiData);
      }
    }
    
    else if (intent === "organisms.geneExpression") {
      let apiOrganisms = await atlasapprox.organisms("gene_expression");
      let numOrganisms = apiOrganisms.organisms.length;
      answer += `There are ${numOrganisms} organisms available:<br>`;
      answer += buildAnswer(intent, apiOrganisms);
    }

    else if (intent === "average.chromatinAccessibility") {
      params['measurement_type'] = 'chromatin_accessibility';
      apiData = await atlasapprox.average(params.organism, params.features, params.organ, null, params.measurement_type);
      answer += buildAnswer(intent, apiData);
    }

    else if (intent === "similar_features.geneExpression") {
      params['feature'] = params['features'];
      delete params['features'];
    
      apiData =  await atlasapprox.similar_features(params.organism, params.organ, params.feature, params.number)
      answer += `Genes similar to ${params['feature']}: ${apiData['similar_features']}`;
    } 
      
    else if (intent === "highest_measurement.geneExpression") {
      params['feature'] = params['features'];
      params['number'] = '10';
      delete params['features'];
      apiData = await atlasapprox.highest_measurement(params.organism, params.feature, params.number);
      answer = buildAnswer(intent, apiData);
    } 

    else if (intent === "highest_measurement.chromatinAccessibility") {
      params['feature'] = params['features'];
      params['number'] = '10';
      delete params['features'];
      params['measurement_type'] = 'chromatin_accessibility';
      apiData = await atlasapprox.highest_measurement(params.organism, params.feature, params.number,params.measurement_type);
      answer = buildAnswer(intent, apiData);
    }

    else if (intent === "organisms.chromatinAccessibility") {
      params['measurement_type'] = 'chromatin_accessibility';
      apiData = await atlasapprox.organisms(params.measurement_type);
      answer = buildAnswer(intent, apiData);
    }

    else if (intent === "feature_sequences.geneExpression") {
      endpoint = "sequences";
      apiData = await atlasapprox[endpoint](params.organism, params.features);
      answer = buildAnswer(intent, apiData);
    }

    else if (intent === "markers.geneExpression") {
      apiData = await atlasapprox.markers(params.organism, params.organ, params.celltype, params.number)
      answer = buildAnswer(intent, apiData);
    }

    else if (intent === "celltypexorgan.geneExpression") {
      console.log(params);
      apiData = await atlasapprox.celltypexorgan(params.organism)
      answer = buildAnswer(intent, apiData);
    }
    // else {
    //   apiData = await callAPI(endpoint, params);
    //   answer += buildAnswer(intent, apiData);
    //   console.log("debugging");
    // }

  } catch (error) {
    console.error("An error occurred:", error);
      return {
        hasData: false,
        message: "Sorry, something went wrong. Please try again later.",
      };
  }

  return {
    hasData: true,
    params: params,
    data: apiData,
    message: answer,
  };
};

