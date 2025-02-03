/**
 * Fetches cell type description from EBI OLS API
 * @param {string} cellType - The cell type to search for
 * @returns {string} - The description of the cell type
 */

import { mapCellTypeName } from "./nameMapper";

export const fetchCellTypeDescription = async (cellType) => {
  try {
    const updatedCellType = mapCellTypeName(cellType);
    const response = await fetch(`https://www.ebi.ac.uk/ols4/api/search?q=${encodeURIComponent(updatedCellType)}`);
    const data = await response.json();
    
    // Find the most relevant description
    const descriptions = data.response.docs
      .filter(doc => 
        doc.label.toLowerCase() === updatedCellType.toLowerCase() &&
        doc.description &&
        doc.description.length > 0
      )
      .map(doc => doc.description[0]);

    // Return the first relevant description or a default message
    return descriptions[0] || `No detailed description available for ${updatedCellType}`;
  } catch (error) {
    console.error('Error fetching cell type description:', error);
    return `Unable to fetch description for ${cellType}`;
  }
};