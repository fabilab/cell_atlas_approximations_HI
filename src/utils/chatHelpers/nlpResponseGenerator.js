import { AtlasApproxNlp } from "@fabilab/atlasapprox-nlp";

const nlp = new AtlasApproxNlp();
await nlp.initialise();

// Construct an answer given the API has provided the requested information
const buildAnswer = (intent, plotState, data = null) => {
  function _chainList(list, sep, end) {
        let text = "";
        for (let i=0; i < list.length; i++) {
            text += list[i];
            if (i !== list.length - 1)
                text += sep;
            else
                text += end;
        }
        return text;
    }

    let answer;
    const intentParts = intent.split(".");
    const gIntent = intentParts[0];
    let sIntent = "", addIntent = "";
    if (intentParts.length > 1) {
      sIntent = intentParts[1];
      if (intentParts.length > 2)
        addIntent = intentParts[2];
    }
      
    switch (gIntent) {
      case "measurement_types":
        answer = "The available measurement types are: " + _chainList(data.measurement_types, ", ", ".");
        break;
      case "organisms":
        answer = _chainList(data.organisms, ", <br>", ".");
        answer += "<br><br>To start exploring an organism's data, type 'explore' followed by the organism abbreviation. <br><br>For example: 'explore h_sapiens' for human.";
        break;
      case "organs":
        answer = "The available organs for " + data.organism + " are: " + _chainList(data.organs, ", ", ".");
        if ((data.organs.length === 1) && (data.organs[0] === "whole"))
            answer = "Cells from this organism were dissociated without separating the tissues first. This happens mostly in small organisms, which can be difficult to dissect. While organ information is not directly available, you can ask about cell types: many are good proxies for tissues in this organism. To specify an organ to the chat bot, use 'whole'.";
        break;
      case "celltypes":
        answer = "The cell types available in " + data.organism + " " + data.targetOrgan + " are: " + _chainList(data.targetCelltypes, ", ", ".");
        break;
      case "celltype_location":
        if (data.organs.length === 0) {
          answer = "The cell type " + data.celltype + " was not detected in any organ of " + data.organism + ".";
        } else {
          answer = "In " + data.organism + ", " + data.celltype + " cells were detected within the " + _chainList(data.organs, ", ", ".");
        }
        break;
      case "average":
        switch (addIntent) {
          case "across_organs":
            switch (sIntent) {
              case "geneExpression":
                answer = "The average expression of " + data.features + " in " + data.organism + " " + data.celltype + " across various organs is shown in the plot.";
                break;
              case "chromatinAccessibility":
                answer = "The average accessibility of " + data.features + " in " + data.organism + " " + data.celltype + " is shown in the plot.";
                break;
              default:
                answer = "The average is shown in the plot.";
            }
            break;
          default:
            switch (sIntent) {
              case "geneExpression":
                answer = "The average expression of " + data.features + " in " + data.organism + " " + data.organ + " is shown in the plot.";
                break;
              case "chromatinAccessibility":
                answer = "The average accessibility of " + data.features + " in " + data.organism + " " + data.organ + " is shown in the plot.";
                break;
              default:
                answer = "The average is shown in the plot.";
            }
        }
        answer += "<br><br>To log/unlog the data for better dynamic range, type \"log data\". You can also try \"add gene1,gene2\" and \"remove gene1,gene2\".<br><br>To download either the plot or the data, use the toolbar that shows when you hover on the plot.";
        break;
      case "fraction_detected":
        switch (addIntent) {
          case "across_organs":
            answer = "A dot plot of " + data.features + " in " + data.organism + " " + data.celltype + " is shown in the plot.";
            break;
          default:
            answer = "A dot plot of " + data.features + " in " + data.organism + " " + data.organ + " is shown in the plot.";
        }
        answer += "<br><br>To log/unlog the data for better dynamic range, type \"log data\". You can also try \"add gene1,gene2\" and \"remove gene1,gene2\".<br><br>To download either the plot or the data, use the toolbar that shows when you hover on the plot.";
        break;
      case "markers":
        switch (sIntent) {
          case "geneExpression":
            answer = "The marker genes for " + data.celltype + " in " + data.organism + " " + data.organ + " are: " + data.markers;
            break;
          case "chromatinAccessibility":
            answer = "The marker peaks for " + data.celltype + " in " + data.organism + " " + data.organ + " are: " + data.markers;
            break;
          default:
            answer = "The markers for " + data.celltype + " in " + data.organism + " " + data.organ + " are: " + data.markers;
        }
        if (addIntent !== "across_organs") {
          answer += "<br><br>Type \"zoom in\" to see the data at the cell state level.";
        }
        break;
      case "interactors":
        switch (sIntent) {
          case "geneExpression":
            const queriedGenes = [...new Set(data.queries)];
            let tempAnswer = `The interaction partners of ${queriedGenes.join(' and ')} are: ${data.targets.join(', ')}.`;
            answer = tempAnswer;
            break;
          default:
          answer = `The interaction partners of ${queriedGenes.join(' and ')} are: ${data.targets.join(', ')}.`;
        }
        break;
      case "similar_features":
        switch (sIntent) {
          case "geneExpression":
            answer = "The genes similar to " + data.feature + " in " + data.organism + " " + data.organ + " are: " + data.similar_features;
            break;
          case "chromatinAccessibility":
            answer = "The peaks with similar accessibility to " + data.feature + " in " + data.organism + + " " + data.organ + " are: " + data.similar_features;
            break;
          default:
            answer = "The features similar to " + data.feature + " in " + data.organism + " " + data.organ + " are: " + data.similar_features;
        }
        break;
      case "similar_celltypes":
        answer = "The cell types similar to " + data.celltype + " in " + data.organism + " are: " + data.similar_celltypes;
        break;
      case "celltypexorgan":
        answer = "The presence matrix of cell types in " + data.organism + " is shown in the plot.";
        answer += "<br><br>Type <b>'download'</b> to get the table data in CSV format."
        break;
      case "comeasurement":
        answer = `Here's the coexpression of ${typeof data.features === 'string' ? data.features.split(',').join(' and ') : data.features.join(' and ')} across all organs of ${data.organism}.`;
        answer += "<br><br>Type \"log\" to switch between linear and log scales.";
        if (data?.by === 'celltype') {
          answer += "<br><br>Type \"zoom in\" to visualise data at cell state level.";
        } else if (data?.by === 'cellstate') {
          answer += "<br><br>Type \"zoom out\" to visualise the data back at cell type level.";
        }
        break;
      case "organxorganism":
        answer = "The presence of <b>" + data.celltype + " </b>cells across different organs and species is shown in the table.";
        answer += "<br><br>Type <b>'download'</b> to get the table data in CSV format."
        break;
      case "highest_measurement":
        switch (sIntent) {
          case "geneExpression":
            answer = "The highest expressors of " + data.feature + " are:";
            break;
          case "chromatinAccessibility":
            answer = "The cell types with the most accessibility of " + data.feature + " are:";
            break;
          default:
            answer = "The highest measurement are in:";
        }
        for (let i = 0; i < data.celltypes.length; i++)
          answer += "<br>" + (i+1) + ". " + data.celltypes[i] + " in " + data.organs[i];
        break;
      case "add":
        switch (sIntent) {
          case "features":
            answer = "Features added.";
            break;
          default:
            answer = "Added.";
        }
        break;
      case "zoom":
        switch (sIntent) {
          case "in":
            answer = "Type \"zoom out\" to visualise the data back at cell type level.";
            break;
          case "out":
            answer = "Type \"zoom in\" to visualise data at cell state level.";
            break;
          default:
            answer = "Done";
        }
        break;
      case "remove":
        switch (sIntent) {
          case "features":
            answer = "Features removed.";
            break;
          default:
            answer = "Removed.";
        }
        break;
      case "plot":
        switch (sIntent) {
          case "log":
            answer = "Done! Data has been modified as requested. Type \"log\" again to toggle between logged and linear data.";
            break;
          default:
            answer = "Done";
        }
        break;
      case "convert_to":
        switch (sIntent) {
          case "dotplot":
            answer = "Done! The plot has been converted as requested";
            break;
          default:
            answer = "Done";
        }
        break;
      case "explore":
        switch (sIntent) {
          case "organism":
            answer = `Fantastic choice! Check out the explore section on the right side of the page to dive deep into the world of ${data.organism} atlas`
            break;
          default:
            answer = "Done";
        }
        break;
      case "feature_sequences":
        switch (sIntent) {
          case "geneExpression":
            answer = "The sequences of " + data.features + " in " + data.organism + " are shown.<br><br>Type \"download\" to get a FASTA file of them all.";
            answer += "<br><br>Please note that currently only protein sequences are available. We are still working on providing RNA sequences, including for noncoding RNAs.";
            break;
          default:
            answer = "Done";
        }
        break;
      case "download":
        if (data.success)
          answer = "Data can be downloaded using the pop-up window.";
        else
          answer = "Sorry, you cannot download data from this page.";
        break;
      case "neighborhood":
        switch (sIntent) {
          case "geneExpression":
            answer = `The average expression and cell fractions of ${data.features} across cell states are shown in the plot.`
            answer += "<br><br>Hover over the blobs in the embedding for cell type composition information."
            // answer += "Hover over the feature names to color the embedding by the level of that feature. Hover <span class=\"resetStatePlot\"><b>here</b></span> to reset the original colors."
            answer += "<br><br>Type \"zoom out\" to look at cell type averages."
            break;
          default:
            answer = "Done";
        }
        break;
      default:
        answer = "Sorry, I have no answer to that.";
    };

    return answer;
}


const buildAPIParams = (intent, entities) => {

    // Extract endpoint from intent
    let endpoint = intent.split(".")[0];

    // Convert entities in request parameters
    let params = {};
    for (let i=0; i < entities.length; i++) {
        const entity = entities[i];
        let paramValue = entity.sourceText;
        if ((entity.type === "enum") && (entity.option !== undefined))
          paramValue = entity.option;

        // entity names and API parameter names are not exactly the same for clarity
        let paramName = entity.entity;
        if (["nFeatures", "nCelltypes"].includes(paramName))
            paramName = "number";

        params[paramName] = paramValue;
    }

    return {
        'endpoint': endpoint,
        'params': params,
    }
}

export {
  nlp,
  buildAPIParams,
  buildAnswer,
};
