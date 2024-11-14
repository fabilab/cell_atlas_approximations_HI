import atlasapprox from "@fabilab/atlasapprox";

/**
 * Finds which species contain a specific cell type
 * @param {string} cellType - The cell type to search for
 * @returns {Promise<string[]>} Array of species that have this cell type
 */
const findSpeciesWithCellType = async (cellType) => {
  try {
    // Call the organxorganism endpoint to find out which species contains fibroblast data
    const data = await atlasapprox.organxorganism({
      celltype: cellType,
    });

    return data.organisms;
  } catch (error) {
    console.error('Error finding species with cell type:', error);
    throw error;
  }
};

/**
 * Gets the organ distribution data for a cell type across all relevant species
 * @param {string} cellType - The cell type to analyze
 * @returns {Promise<Object>} Processed data for visualization
 */
const getCellTypeDistribution = async (cellType) => {
    try {
      // First, find all species that have this cell type
      const speciesList = await findSpeciesWithCellType(cellType);
      
      if (speciesList.length === 0) {
        return {
          success: false,
          message: `No species found containing ${cellType}`,
          data: null
        };
      }
  
      // Then, for each species, get the organ distribution
      const organDistributionPromises = speciesList.map(organism => 
        atlasapprox.celltypexorgan({
          celltype: cellType,
          organism: organism,
          measurement_type: "gene_expression"
        })
      );
  
      // Wait for all API calls to complete
      const organDistributionData = await Promise.all(organDistributionPromises);
  
      // Process the data for each species
      const processedData = organDistributionData.map(data => {
        const { organism, organs, celltypes, detected } = data;
        
        // Find index of our cell type in this species' data
        const cellTypeIndex = celltypes.findIndex(
          ct => ct.toLowerCase() === cellType.toLowerCase()
        );
  
        // Get counts for each organ
        const organCounts = organs.map((organ, index) => ({
          organ: organ.toLowerCase(),
          count: detected[cellTypeIndex][index]
        })).filter(item => item.count > 0);
  
        return {
          organism,
          organCounts
        };
      });
  
      return {
        success: true,
        data: processedData,
      };
    } catch (error) {
      console.error('Error getting cell type distribution:', error);
      return {
        success: false,
        message: error.message,
        data: null
      };
    }
  };
  
  export { findSpeciesWithCellType, getCellTypeDistribution };

