import atlasapprox from "@fabilab/atlasapprox";
import { buildAPIParams, buildAnswer } from './nlpHelpers.js';
import { downloadFasta } from "./downloadFasta";
import { getOrganxOrganism } from "./organxorganismData.js";


// decide if an NLP response triggers a plot update
const updatePlotIntents = [
  "add",
  "plot",
  "zoom",
  "remove",
  "explore",
  "average",
  "markers",
  "organisms",
  "neighborhood",
  "celltypexorgan",
  "organxorganism",
  "similar_features",
  "feature_sequences",
  "fraction_detected",
  "similar_celltypes",
  "highest_measurement",
];


const mainIntentNotRequiresApi = [
  "download",
  "plot"
];

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
  let answer = "", apiData = null, endpoint, params;
  let extraEndpointsToCall = [];

  if (intent === "None") {
    return {
      hasData: false,
      message: "Sorry I didn't get that. Please rephrase.",
    };
  }

  // If incomplete, follow up question
  if (!complete) {
    return {
      hasData: false,
      message: response.followUpQuestion,
    };
  }

  ({ endpoint, params } = buildAPIParams(intent, entities));

  // If the intent does not require an API, just build the answer
  if (mainIntentNotRequiresApi.includes(mainIntent)) {
    switch (mainIntent) {
      case "download":
        let downloadAvailable = true;
        try {
          downloadFasta(plotState)
        } catch (err) {
          downloadAvailable = false;
        }
        answer = buildAnswer(intent, { success: downloadAvailable });
        return {
          message: answer,
        }
      case "plot":
        answer = buildAnswer(intent);
        return {
          hasData: true,
          params: params,
          data: plotState.data,
          message: answer,
        };
      default:
        answer = buildAnswer(intent);
        return {
          message: answer,
        }
    }
  }

  
  if(intent === "organxorganism.geneExpression") {
    let data = await getOrganxOrganism(params.celltype, "gene_expression");
    return {
      hasData: data !== null,
      params: params || null,
      data: data || null,
      message: `The presence of <b> ${params.celltype} cells </b> across different organs and species is shown in the table.`,
    };
  }

  // Intents that requires API calls & error handling
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
    if (mainIntent === 'similar_features') {
      extraEndpointsToCall.push('dotplot');
    } 

    if (intent === 'explore.organism.geneExpression') {
      endpoint = 'organs';
      params['measurement_type'] = "gene_expression"
    } else if (intent === "explore.organism.chromatinAccessibility") {
      endpoint = 'organs'
      params['measurement_type'] = "chromatin_accessibility";
    }

    if ((intent === 'zoom.out.neighborhood') && (plotState.plotType === 'neighborhood')) {
        // FIXME: figure out measurement type from plot state (needs some implementing)
        response.intent = intent = 'fraction_detected.geneExpression';
        mainIntent = "fraction_detected";
        params = {
          organ: plotState.organ,
          organism: plotState.organism,
          features: plotState.features,
          // FIXME: see above
          measurement_type: "gene_expression",
        };
    }

    if ((intent === 'zoom.in.neighborhood') && (['fractionDetected', 'average'].includes(plotState.plotType))) {
      // FIXME: figure out measurement type from plot state (needs some implementing)
      response.intent = intent = 'neighborhood.geneExpression';
      mainIntent = endpoint = "neighborhood";
      params = {
        organ: plotState.organ,
        organism: plotState.organism,
        features: plotState.features,
        // FIXME: see above
        measurement_type: "gene_expression",
      };
    }

    if (mainIntent === 'fraction_detected') {
      endpoint = "dotplot";
    }
    if (['add', 'remove'].includes(mainIntent)) {
      params['organism'] = plotState.organism; 

      if (plotState.plotType.endsWith("AcrossOrgans")) {
        params['celltype'] = plotState.celltype;
      } else {
        params['organ'] = plotState.organ;
      }

      if (plotState.plotType.startsWith("fraction")) {
        endpoint = "dotplot";
      } else {
        endpoint = 'average';
      }

      if (mainIntent === 'add' && params.features && plotState.features) {
        let plotStateGenes;
        if (plotState.plotType === 'neighborhood') {
          plotStateGenes = plotState.features;
          endpoint = 'neighborhood';
        } else {
          plotStateGenes = plotState.features.split(',').map(gene => gene.trim());
        }
        params.features = [...new Set([...params.features.split(','), ...plotStateGenes])].join(',');
      }

      if (mainIntent === 'remove' && params.features && plotState.features) {
        let geneArrayA, geneArrayB;
        if (plotState.plotType === 'neighborhood') {
          geneArrayA = params.features.split(",");
          geneArrayB = plotState.features;
          endpoint = 'neighborhood';
        } else {
          geneArrayA = params.features.split(",");
          geneArrayB = plotState.features.split(",");
        }
        params.features = geneArrayB.filter(gene => !geneArrayA.includes(gene)).join(",");
      }

    }

    //  Finally, generate bot response and api data for the given intent
    apiData = await atlasapprox[endpoint](params);

    if (intent === "organisms.geneExpression") {
      let numOrganisms = apiData.organisms.length;
      answer = `There are ${numOrganisms} organisms available:<br>`;
    }
    answer += buildAnswer(intent, apiData);

    if (params.organ && apiData.celltypes && mainIntent !== "neighborhood") {
      answer += `<br><br>It includes ${apiData.celltypes.length} cell types and ${apiData.features.length} features.`
    }


    if (intent === "markers.geneExpression" || intent === "markers.chromatinAccessibility") {
      if (apiData.markers.length === 0) {
        answer = `There is no markers detected in ${apiData.organism} ${apiData.organ}`;
      } else {
          extraEndpointsToCall.push('dotplot');
      }
    }
    // for intent like "marker, fraction, similar celltypes"
    for (const e of extraEndpointsToCall) {
      if (mainIntent === 'similar_features' || mainIntent === 'markers') {
        params.features = [...apiData[endpoint]];
        endpoint === 'similar_features' && params.features.push(params.feature);
        delete params['celltype']
      }
      params.features = [...new Set(params.features)];
      let extraApiData = await atlasapprox[e](params);
      apiData = {...apiData, ...extraApiData};
    }
    
  } catch ({ status, message, error }) {
      let errorValue = error.invalid_value;
      let errorParam = error['invalid_parameter'];
      let mParam = error['missing_parameter'];
      if (error.type === 'missing_parameter') {
        switch(mParam) {
          case 'organism':
            answer += "What species would you like to look at?";
            break;
          case 'organ':
            answer += "What organ would you like to look at?";
            break;
          case 'features':
            answer += "Please list the features (e.g. genes) you would like to look into.";
            break;
          case 'celltype':
            answer += "Which cell type?";
            break;
          case 'organ^celltype':
            answer += "I did not recognise a cell type or an organ. Please repeat the question specifying either one (but not both).";
            // FIXME: this requests to repeat the question, so we should reset the bot
            break;
          default:
            break;
        }
      } else if (error.type === 'invalid_parameter') {
        // invalid gene, we can auto remove it and re-call api
        if (errorParam === 'features') {
          if (typeof params.features === 'string') {
            params.features = params.features.split(',').filter(feature => !errorValue.includes(feature.toLowerCase())).join(',');
          } else {
            // example case: markers of myopeptidocyte in s_lacustris whole
            // remove marker genes that contain a space
            params.features = params.features.filter(feature => !feature.includes(' '));
            //  re call the extra endpoint which is dotplot
            endpoint='dotplot'
          }
        
          if (params.features.length !== 0) {
            apiData = await atlasapprox[endpoint](params);
            if (mainIntent === 'markers') {
              apiData['markers'] = params.features;
              apiData['celltype'] = entities.filter(e => e.entity==='celltype')[0].sourceText;
            }
            answer = `Invalid features detected: "${errorValue}". These have been automatically excluded<br><br>`;
            answer += buildAnswer(intent, apiData);
            answer += `<br><br>It covers ${apiData.celltypes.length} cell types and ${apiData.features.length} genes.`
          } else {
            answer = `The feature "${errorValue}" is not available in our current dataset. Are you sure it is spelled correctly? You can retry the question with a different feature if you like.`;
          }
        } 
        else if (errorParam === 'feature') {
          answer += `The feature "${errorValue}" is not available. Have you checked the spelling of that feature? You can retry with a different fgeature if you like.`;
        } else if (errorParam === 'organism') {
          answer += `Organism "${errorValue}" is not available. Could it be a spelling error? Otherwise, you can try a different species.`;
        } else if (errorParam === 'organ') {
          answer += `Organ "${errorValue}" is not available in this organism. Some organisms (e.g. coral) have been dissociated as "whole", without separating the organs. You can try asking "What organs are available for <organism>?" to get the list of organs for this organism.`;
        } 
        else if (errorParam === 'celltype') {
          answer += `Cell type "${errorValue}" is not available in this context. If you are looking into a specific organ, you can ask "What cell types are available in <organism> <organ>?", otherwise you can draw a table of cell types and organs in that organism by asking "Show cell type by organ table of <organism>".`;
        }
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

