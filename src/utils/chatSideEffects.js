import atlasapprox from "@fabilab/atlasapprox";
import { buildAPIParams, buildAnswer } from "./nlpHelpers.js";
import { downloadFasta } from "./downloadFasta";
import { downloadTable } from "./downloadTable";

const toCamel = (str) => {
  return str.replace(/(?!^)_(.)/g, (_, char) => char.toUpperCase());
};

// updatePlotIntents: An array of intents that trigger a plot update.
// These intents require either fetching data from the API or from previous plot state, and updating the plot accordingly.
const updatePlotIntents = [
  "add",
  "plot",
  "zoom",
  "remove",
  "explore",
  "average",
  "markers",
  "celltypes",
  "organisms",
  "convert_to",
  "neighborhood",
  "comeasurement",
  "celltypexorgan",
  "organxorganism",
  "similar_features",
  "feature_sequences",
  "fraction_detected",
  "similar_celltypes",
  "highest_measurement",
];

// mainIntentNotRequiresApi: An array of main intents that don't require an API call.
// These intents can be handled without fetching data from the API.
const mainIntentNotRequiresApi = ["greetings", "download", "plot"];

// triggersPlotUpdate: Checks if a response triggers a plot update.
// It verifies if the response contains data and if the main intent is included in the updatePlotIntents array.
export const triggersPlotUpdate = (response) => {
  if (!response) return false;
  if (!response.hasData) return false;
  const mainIntent = response.intent.split(".")[0];
  return updatePlotIntents.includes(mainIntent);
};

/**
 * Generates bot responses and fetches data from the API based on the user's intent.
 * @param {object} response - Response returned by calling nlp.ask(user query)
 * @param {object} plotState - State of the current plot
 * @returns {object} - Object containing parameters extracted from user's query, data to make plot, and bot response
 */
export const updateChat = async (response, plotState) => {

  let entities = response.entities;
  let intent = response.intent;
  let mainIntent = intent.split(".")[0];
  let subIntent = intent.split(".")[1] || null;
  let complete = response.complete;
  let answer = "",
    apiData = null,
    endpoint,
    params;
  let extraEndpointsToCall = [];
  // this is defined to store celltypes and organ for celltypes intent.
  let targetCelltypes, targetOrgan;

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

  // prepare the endpoint and parameters based on the user's intent and entities. 
  // modifications might be necessary to ensure the API call functions correctly.
  ({ endpoint, params } = buildAPIParams(intent, entities));

  // If the intent does not require an API, just build the answer
  if (mainIntentNotRequiresApi.includes(mainIntent)) {
    switch (mainIntent) {
      case "download":
        let downloadAvailable = true;
        if (plotState.plotType === "featureSequences") {
          try {
            downloadFasta(plotState);
          } catch (err) {
            downloadAvailable = false;
          }
        } else if (
          plotState.plotType === "celltypeXorgan" ||
          plotState.plotType === "organXorganism"
        ) {
          try {
            downloadTable(plotState, plotState.plotType);
          } catch (err) {
            downloadAvailable = false;
          }
        }
        answer = buildAnswer(intent, plotState, { success: downloadAvailable });
        return {
          message: answer,
        };
      case "plot":
        answer = buildAnswer(intent, plotState);
        return {
          hasData: true,
          params: params,
          data: plotState.data,
          message: answer,
        };
      case "greetings":
        if (subIntent === "bye") {
          return {
            resetEverything: true,
            message: "",
          };
        }
        answer = buildAnswer(intent, plotState);
        return {
          message: answer,
        };
      default:
        answer = buildAnswer(intent, plotState);
        return {
          message: answer,
        };
    }
  }

  // Intents that requires API calls & error handling
  try {
    //  plot conversion
    //  START
    if (mainIntent === "convert_to") {
      const {
        plotType,
        features,
        organ,
        organism,
        celltype,
        measurement_type,
      } = plotState;
      const plotTypeIntentMap = {
        dotplot: {
          average: {
            intent: `fraction_detected.${toCamel(measurement_type)}`,
            params: { features, organ, organism },
          },
          averageAcrossOrgans: {
            intent: `fraction_detected.${toCamel(
              measurement_type
            )}.across_organs`,
            params: { celltype, features, organism },
          },
        },
        heatmap: {
          fractionDetected: {
            intent: `average.${toCamel(measurement_type)}`,
            params: { features, organ, organism },
          },
          fractionDetectedAcrossOrgans: {
            intent: `average.${toCamel(measurement_type)}.across_organs`,
            params: { celltype, features, organism },
          },
        },
      };

      const conversion = plotTypeIntentMap[subIntent]?.[plotType];
      if (conversion) {
        intent = conversion.intent;
        Object.assign(params, conversion.params);
        mainIntent = intent.split(".")[0];
        subIntent = intent.split(".")[1] || null;
      } else {
        return {
          message: "Plot conversion is not available for the current plot type",
        };
      }
    }
    // END

    if (mainIntent === "neighborhood") {
      params["include_embedding"] = true;
    }
    if (subIntent === "chromatinAccessibility") {
      params["measurement_type"] = "chromatin_accessibility";
    }

    if (
      mainIntent === "similar_features" ||
      mainIntent === "highest_measurement"
    ) {
      params["feature"] = params["features"];
      delete params["features"];
    }

    if (intent === "feature_sequences.geneExpression") {
      endpoint = "sequences";
    }

    if (intent === "celltypes.geneExpression") {
      let celltypesAPI = await atlasapprox[endpoint](params);
      targetCelltypes = celltypesAPI.celltypes;
      targetOrgan = celltypesAPI.organ;
      endpoint = "celltypexorgan";
    }

    // for intents that without actual data, we need to make extra api calls
    if (mainIntent === "similar_features") {
      extraEndpointsToCall.push("dotplot");
    }

    if (intent === "explore.organism.geneExpression") {
      endpoint = "organs";
      params["measurement_type"] = "gene_expression";
    } else if (intent === "explore.organism.chromatinAccessibility") {
      endpoint = "organs";
      params["measurement_type"] = "chromatin_accessibility";
    }

    if (
      intent === "zoom.out.neighborhood" &&
      plotState.plotType === "neighborhood"
    ) {
      response.intent = intent = "fraction_detected.geneExpression";
      mainIntent = "fraction_detected";
      params = {
        organ: plotState.organ,
        organism: plotState.organism,
        features: plotState.features,
        measurement_type: "gene_expression",
        include_embedding: true,
      };
    }

    if (
      intent === "zoom.in.neighborhood" &&
      ["fractionDetected", "average"].includes(plotState.plotType)
    ) {
      response.intent = intent = "neighborhood.geneExpression";
      mainIntent = endpoint = "neighborhood";
      params = {
        organ: plotState.organ,
        organism: plotState.organism,
        features: plotState.features,
        measurement_type: "gene_expression",
        include_embedding: true,
      };
    }

    if (mainIntent === "fraction_detected" || mainIntent === "average") {
      endpoint = "dotplot";
    }
    if (["add", "remove"].includes(mainIntent)) {
      params["organism"] = plotState.organism;

      if (plotState.plotType.endsWith("AcrossOrgans")) {
        params["celltype"] = plotState.celltype;
      } else {
        params["organ"] = plotState.organ;
      }

      if (plotState.plotType.startsWith("fraction")) {
        endpoint = "dotplot";
      } else {
        endpoint = "average";
      }

      if (mainIntent === "add" && params.features && plotState.features) {
        let plotStateGenes;
        if (plotState.plotType === "neighborhood") {
          plotStateGenes = plotState.features;
          endpoint = "neighborhood";
          params["include_embedding"] = true;
        } else {
          plotStateGenes = plotState.features
            .split(",")
            .map((gene) => gene.trim());
        }
        params.features = [
          ...new Set([...params.features.split(","), ...plotStateGenes]),
        ].join(",");
      }

      if (mainIntent === "remove" && params.features && plotState.features) {
        let geneArrayA, geneArrayB;
        if (plotState.plotType === "neighborhood") {
          geneArrayA = params.features.split(",");
          geneArrayB = plotState.features;
          endpoint = "neighborhood";
          params["include_embedding"] = true;
        } else {
          geneArrayA = params.features.split(",");
          geneArrayB = plotState.features.split(",");
        }
        params.features = geneArrayB
          .filter((gene) => !geneArrayA.includes(gene))
          .join(",");
      }
    }

    // coexpression of two genes (or comeasurements of two features)
    // FIXME: START COMEASUREMENT -- not quite
    // This happens when either intent is comeasurement or plotState of coexpressScatter and intent is zoom or log
    // get data from all tissues
    if (mainIntent === "comeasurement") {
      endpoint = "organs";
      //apiData = await atlasapprox[endpoint](params);
    }

    // comeasurement has a special double API call, deal with it separately
    if (
      (intent === "zoom.in.neighborhood" ||
        intent === "zoom.out.neighborhood") &&
      plotState.plotType === "coexpressScatter"
    ) {
    } else {
      apiData = await atlasapprox[endpoint](params);
    }

    if (intent === "organisms.geneExpression") {
      let numOrganisms = apiData.organisms.length;
      answer = `There are ${numOrganisms} organisms available:<br>`;
    }

    if (plotState.plotType === "coexpressScatter") {
      // from scatter by cell type to by cell state, call API about averages in cell states
      if (intent === "zoom.in.neighborhood") {
        const organs = plotState.organs;
        params.organism = plotState.organism;
        params.features = plotState.features;
        const averagePromises = organs.map((organ) => {
          params.organ = organ;
          return atlasapprox["neighborhood"](params);
        });

        const expData = await Promise.all(averagePromises);
        // FIXME: this is part of a big refactoring that needs to happen
        response.intent = intent = "comeasurement.geneExpression";
        apiData = {
          expData: expData,
          features: params.features,
          organism: params.organism,
          organs: organs,
          by: "cellstate",
        };

        // from scatter by cell state to by cell type, call API about averages in cell types: the API call is not immediately here because this
        // looks much like a direct request for co-expression
      } else if (intent === "zoom.out.neighborhood") {
        // FIXME: this is part of a big refactoring that needs to happen
        response.intent = intent = "comeasurement.geneExpression";
        mainIntent = "comeasurement";
      }
    }

    if (mainIntent === "comeasurement") {
      let organs;
      if (plotState && plotState.by === "cellstate") {
        organs = plotState.organs;
        params.organism = plotState.organism;
        params.features = plotState.features;
      } else {
        organs = apiData.organs;
      }
      const averagePromises = organs.map((organ) => {
        params.organ = organ;
        return atlasapprox["average"](params);
      });
      const expData = await Promise.all(averagePromises);
      apiData = {
        expData: expData,
        features: params.features,
        organism: params.organism,
        organs: organs,
        by: "celltype",
      };
    }
    // END COMEASUREMENT

    if (intent === "celltypes.geneExpression") {
      apiData.targetCelltypes = targetCelltypes;
      apiData.targetOrgan = targetOrgan;
    }

    console.log("Update chat, right before building answer...");
    console.log(intent);
    console.log(plotState);
    console.log(apiData);

    answer += buildAnswer(intent, plotState, apiData);

    console.log("Reporting answer after buildAnswer:");
    console.log(answer);

    if (params.organ && apiData.celltypes && mainIntent !== "neighborhood") {
      answer += `<br><br>It includes ${apiData.celltypes.length} cell types and ${apiData.features.length} features.`;
    }

    if (
      intent === "markers.geneExpression" ||
      intent === "markers.chromatinAccessibility"
    ) {
      if (apiData.markers.length === 0) {
        answer = `There is no markers detected in ${apiData.organism} ${apiData.organ}`;
      } else {
        extraEndpointsToCall.push("dotplot");
      }
    }

    // for intent like "marker, fraction, similar celltypes"
    for (const e of extraEndpointsToCall) {
      if (mainIntent === "similar_features" || mainIntent === "markers") {
        params.features = [...apiData[endpoint]];
        endpoint === "similar_features" && params.features.push(params.feature);
        delete params["celltype"];
      }
      params.features = [...new Set(params.features)];
      let extraApiData = await atlasapprox[e](params);
      apiData = { ...apiData, ...extraApiData };
    }
  } catch ({ status, message, error }) {
    let errorValue = error.invalid_value;
    let errorParam = error["invalid_parameter"];
    let mParam = error["missing_parameter"];
    if (error.type === "missing_parameter") {
      switch (mParam) {
        case "organism":
          answer += "What species would you like to look at?";
          break;
        case "organ":
          answer += "What organ would you like to look at?";
          break;
        case "features":
          answer +=
            "Please list the features (e.g. genes) you would like to look into.";
          break;
        case "celltype":
          answer += "Which cell type?";
          break;
        case "organ^celltype":
          answer +=
            "I did not recognise a cell type or an organ. Please repeat the question specifying either one (but not both).";
          // FIXME: this requests to repeat the question, so we should reset the bot
          break;
        default:
          break;
      }
    } else if (error.type === "invalid_parameter") {
      // invalid gene, we can auto remove it and re-call api
      if (errorParam === "features") {
        if (typeof params.features === "string") {
          if (mainIntent === "comeasurement") {
            if (errorValue.length === 1) {
              answer += `The gene "${errorValue}" is not valid. Please ensure that gene names are spelled correctly.`;
            } else if (errorValue.length === 2) {
              answer += `The genes "${errorValue}" are not valid. Please ensure that gene names are spelled correctly.`;
            }
            apiData = null;
          } else {
            params.features = params.features
              .split(",")
              .filter((feature) => !errorValue.includes(feature.toLowerCase()))
              .join(",");
          }
        } else {
          // example case: markers of myopeptidocyte in s_lacustris whole
          // remove marker genes that contain a space
          params.features = params.features.filter(
            (feature) => !feature.includes(" ")
          );
          //  re call the extra endpoint which is dotplot
          endpoint = "dotplot";
        }

        if (mainIntent !== "comeasurement") {
          if (params.features.length !== 0) {
            apiData = await atlasapprox[endpoint](params);
            if (mainIntent === "markers") {
              apiData["markers"] = params.features;
              apiData["celltype"] = entities.filter(
                (e) => e.entity === "celltype"
              )[0].sourceText;
            }
            answer += `Invalid features detected: "${errorValue}". These have been automatically excluded<br>`;
            answer += buildAnswer(intent, plotState, apiData);
            answer += `<br><br>It covers ${apiData.celltypes.length} cell types and ${apiData.features.length} genes.`;
          } else {
            answer = `The feature "${errorValue}" is not available in our current dataset. Are you sure it is spelled correctly? You can retry the question with a different feature if you like.`;
          }
        }
      } else if (errorParam === "feature") {
        answer += `The feature "${errorValue}" is not available. Have you checked the spelling of that feature? You can retry with a different fgeature if you like.`;
      } else if (errorParam === "organism") {
        answer += `Organism "${errorValue}" is not available. Could it be a spelling error? Otherwise, you can try a different species.`;
      } else if (errorParam === "organ") {
        answer += `Organ "${errorValue}" is not available in this organism. Some organisms (e.g. coral) have been dissociated as "whole", without separating the organs. You can try asking "What organs are available for <organism>?" to get the list of organs for this organism.`;
      } else if (errorParam === "celltype") {
        answer += `Cell type "${errorValue}" is not available in this context. If you are looking into a specific organ, you can ask "What cell types are available in <organism> <organ>?", otherwise you can draw a table of cell types and organs in that organism by asking "Show cell type by organ table of <organism>".`;
      }
    } else {
      answer = message;
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
