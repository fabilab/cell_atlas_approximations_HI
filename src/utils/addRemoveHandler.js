// addRemoveHandler.js
export const handleAddRemove = (mainIntent, params, plotState, endpoint) => {
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
  
    return { params, endpoint };
  };