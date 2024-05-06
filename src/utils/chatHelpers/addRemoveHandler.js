// This function is written to handle adding and removing genes from plots.
// It's applicable for both heatmap,dotplot and cell state plot
export const handleAddRemove = (mainIntent, params, plotState, endpoint) => {
  console.log(params);
  console.log(plotState);
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
    console.log(params.features);
    console.log(plotState.features);
    let plotStateGenes;
    if (plotState.plotType === "neighborhood") {
      plotStateGenes = plotState.features;
      endpoint = "neighborhood";
      params["include_embedding"] = true;
    } else {
      plotStateGenes = Array.isArray(plotState.features)
      ? plotState.features
      : plotState.features.split(",").map((gene) => gene.trim());
    }
    const paramsFeatures = typeof params.features === 'string'
    ? params.features.split(",")
    : params.features;

    params.features = [...new Set([...paramsFeatures, ...plotStateGenes])].join(",");

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
      geneArrayB = typeof plotState.features === 'string' ? plotState.features.split(',') : plotState.features;
    }
    params.features = geneArrayB
      .filter((gene) => !geneArrayA.includes(gene))
      .join(",");
  }
  return { params, endpoint };
};
