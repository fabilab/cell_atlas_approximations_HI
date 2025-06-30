/**
 * Fetches cell type description from EBI OLS API
 * @param {string} cellType - The cell type to search for
 * @returns {dict} - The description of the cell type
 */

import { mapCellTypeName } from "./nameMapper";

export const fetchCellTypeDescription = async (cellType) => {
  try {
    const updatedCellType = mapCellTypeName(cellType);
    const response = await fetch(
      `https://www.ebi.ac.uk/ols4/api/search?q=${encodeURIComponent(updatedCellType)}`
    );
    const data = await response.json();

    const descriptions = data.response.docs
      .filter(
        (doc) =>
          doc.label.toLowerCase() === updatedCellType.toLowerCase() &&
          doc.description &&
          doc.description.length > 0
      )
      .map((doc) => doc.description[0]);

    if (descriptions.length > 0) {
      return {
        text: descriptions[0],
        hasSource: true
      };
    }

    return {
      text: `No detailed description available for ${updatedCellType}.`,
      hasSource: false
    };
  } catch (error) {
    console.error("Error fetching cell type description:", error);
    return {
      text: `Unable to fetch description for ${cellType}`,
      hasSource: false
    };
  }
};
