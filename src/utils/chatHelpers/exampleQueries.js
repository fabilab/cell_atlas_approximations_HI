export const exampleQueries = {
    // Explore intents
    "explore.organism.geneExpression": "explore [organism]",
    "explore.organism.chromatinAccessibility": "explore the chromatin state of [organism]",
    
    // Measurement types intent
    "measurement_types": "what measurement types are available?",
    
    // Organs intents
    "organs.geneExpression": "list organs for [organism]",
    "organs.chromatinAccessibility": "list organs in chromatin accessibility for [organism]",
    
    // Organisms intents
    "organisms.geneExpression": "what species are available?",
    "organisms.chromatinAccessibility": "what species are there in chromatin accessibility?",
    
    // Cell types intents
    "celltypes.geneExpression": "list cell types in [organism] [organ]",
    "celltypes.chromatinAccessibility": "list chromatin accessibility cell types in [organism] [organ]",
    
    // Cell type location intents
    "celltype_location.geneExpression": "where are [celltype] in [organism]?",
    
    // Cross-analysis intents
    "celltypexorgan.geneExpression": "show cell type presence across organs in [organism]",
    "organxorganism.geneExpression": "show organs containing [celltype] across species",
    "celltypexorgan.chromatinAccessibility": "show cell type presence by chromatin accessibility across organs in [organism]",
    
    // Expression analysis intents
    "average.geneExpression.across_organs": "what is the expression of [gene] across organs in [organism] [celltype]?",
    "fraction_detected.geneExpression": "what is the fraction of cells expressing [gene] in [organism] [organ]?",
    "fraction_detected.chromatinAccessibility": "what is the fraction of cells with open chromatin at [features] in [organism] [organ]?",
    
    // Marker analysis intents
    "markers.geneExpression": "what are the markers of [celltype] in [organism] [organ]?",
    "markers.chromatinAccessibility": "what are the chromatin accessibility markers of [celltype] in [organism] [organ]?",
    
    // Feature analysis intents
    "similar_features.geneExpression": "what genes are similar to [gene] in [organism] [organ] [celltype]?",
    "homologs.geneExpression": "what are the homologs of [gene] in [target_organism]?",
    
    // Coexpression analysis intents
    "comeasurement.geneExpression": "show coexpression of [gene] with [gene] across organs in [organism]",
    "interactors.geneExpression": "what are the interactors of [gene] in [organism]?",
    
    // Neighborhood analysis intents
    "neighborhood.geneExpression": "show neighborhood of [gene] in [organism] [organ]",
    "zoom.in.neighborhood": "zoom in on the neighborhood",
    "zoom.out.neighborhood": "zoom out from the neighborhood",

    // highest measurement:
    "highest_measurement.geneExpression": "what cell type is the highest expressor of [gene] in [organism]?",
    "highest_measurement.chromatinAccessibility": "who has the most accessible chromatin at [features] in [organism]?",
    
    // else:
    "link.video": "where is the video guide?",
    "link.api": "where is the programmatic access?",
    "link.userguide": "where is the user guide?",  
    "convert_to.dotplot": "convert to dotplot",
    "convert_to.heatmap": "convert to heatmap",
    "plot.log": "toggle log",
    "add.features": "add [features]",
    "remove.features": "remove [features]",
    "download": "download as [format]"
  };
  