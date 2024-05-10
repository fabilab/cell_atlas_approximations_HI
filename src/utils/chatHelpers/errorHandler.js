import { buildAnswer } from "./nlpResponseGenerator.js";
import atlasapprox from "@fabilab/atlasapprox";

export const handleErrors = async (error, mainIntent, params, entities, answer, endpoint, plotState, intent, message, apiData = null) => {

    let errorValue = error.invalid_value;
    let errorParam = error["invalid_parameter"];
    let mParam = error["missing_parameter"];
    let existingApiData = apiData;

    if (error.type === "missing_parameter") {
      switch (mParam) {
        case "organism":
          answer += "What species would you like to look at?";
          break;
        case "organ":
          answer += "What organ would you like to look at?";
          break;
        case "features":
          answer += "Please list the features (e.g. genes) you would like to look into.";
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
      // Invalid gene, we can auto remove it and re-call api
      // Need to handle both cases where features can be either a string or an object.
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
        } else if (intent === "interactors.geneExpression" && typeof params.features === "object") {
            params.features = params.features
            .filter((feature) => !errorValue.includes(feature.toLowerCase()))
            endpoint = "dotplot";
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
            if (intent !== "interactors.geneExpression") {
              answer += `Invalid features detected: "${errorValue}". These have been automatically excluded<br>`;
              answer += buildAnswer(intent, plotState, apiData);
              answer += `<br><br>It covers ${apiData.celltypes ? `${apiData.celltypes.length} cell types` : '1 cell type'} and ${apiData.features.length} genes.`;
            }
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
    if (intent === "interactors.geneExpression") {
      apiData.queries = existingApiData.queries;
      apiData.targests = existingApiData.targest;
    }
    return { params, apiData, answer };
};