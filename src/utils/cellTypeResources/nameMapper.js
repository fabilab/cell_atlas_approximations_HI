/**
 * This function maps shorthand or ambiguous cell type names to standardized names.
 * It is used for searching cell type descriptions and images for the cell type profile display.
 */


export const cellTypeNameMappings = {
    T: "T cell",
    B: "B cell",
    NK: "Natural killer cell",
    NKT: "Natural killer T cell",
    mTEC: "Medullary thymic epithelial cell",
    ILC: "Innate lymphoid cell",
    "smooth muscle": "Smooth muscle cell",
    AT1: "Alveolar Type 1 cell",
    AT2: "Alveolar Type 2 cell",
  };
  
  /**
   * Maps a given cell type name to its standardized descriptive name.
   * If the cell type is not found in the mapping, the original name is returned.
   *
   * @param {string} cellTypeName - The cell type name to map.
   * @returns {string} - The standardized cell type name.
   */
  export const mapCellTypeName = (name) => {
    // Group 1: Abbreviations that need expansion
    const abbreviationMappings = {
        "AT1": "Alveolar Type 1 Cell",
        "AT2": "Alveolar Type 2 Cell",
        "HSC": "Hematopoietic stem cell",
        "ILC": "Innate lymphoid cell",
        "NK": "Natural killer Cell",
        "NKT": "Natural killer T cell",
        "PP": "Peyer's patch cell",
        "PSM": "Presomitic mesoderm cell",
        "Treg": "Regulatory T Cell",
        "mTEC": "Medullary thymic epithelial cell",
        "opc": "Oligodendrocyte precursor cell",
        "CAP2": "Channel-forming integral protein 2"
    };
    
    // Group 2: Suffixes that don't need "cell" added
    const completeSuffixes = [
        "blast",      // e.g., fibroblast, neuroblast
        "cyte",       // e.g., adipocyte, chondrocyte
        "phil",       // e.g., basophil, eosinophil
        "phage",      // e.g., macrophage
        "phore",      // e.g., iridophore, melanophore
        "neuron",     // e.g., interneuron
        "ocyte",      // e.g., spermatocyte
        "oblast",     // e.g., osteoblast
        "onium",      // e.g., spermatogonium
    ];

    // If it's an abbreviation that needs expansion
    if (abbreviationMappings.hasOwnProperty(name)) {
        return abbreviationMappings[name];
    }
    
    // Group 2: Check if it ends with any complete suffix
    if (completeSuffixes.some(suffix => name.toLowerCase().endsWith(suffix)) || 
        name.toLowerCase().endsWith('cell')) {
        return name;
    }
    
    // Group 3: Simply add "Cell" to everything else
    return `${name} cell`;
}
  