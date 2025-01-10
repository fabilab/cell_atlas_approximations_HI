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
  export const mapCellTypeName = (cellTypeName) => {
    // Normalize input for case-insensitive matching
    const normalizedCellTypeName = cellTypeName.toLowerCase();

    const mappedType = Object.entries(cellTypeNameMappings).find(([key]) =>
      key.toLowerCase() === normalizedCellTypeName
    );
    // Return the mapped name or the original name if no match is found
    return mappedType ? mappedType[1] : cellTypeName;
  };
  