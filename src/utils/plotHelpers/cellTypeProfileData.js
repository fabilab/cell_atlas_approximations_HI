import atlasapprox from "@fabilab/atlasapprox";

/**
 * Fetches the distribution of a given cell type across species and organs
 * @param {string} cellType - The cell type to analyze (e.g., "macrophage")
 * @returns {Promise<Object>} Processed data for visualization
 */
const getCellTypeDistribution = async (cellType) => {
  try {
    // Step 1: Find which species contain the cell type
    const presenceData = await atlasapprox.organxorganism({ celltype: cellType });

    if (!presenceData || !presenceData.organisms.length) {
      return { success: false, message: `No species found containing ${cellType}`, data: null };
    }

    const speciesList = presenceData.organisms;
    const detectedMatrix = presenceData.detected; // Matrix indicating cell type presence (0/1)

    // Step 2: Fetch abundance data for each species using celltypexorgan
    const speciesAbundancePromises = speciesList.map(organism =>
      atlasapprox.celltypexorgan({
        organism,
        measurement_type: "gene_expression",
      })
    );

    const abundanceDataArray = await Promise.all(speciesAbundancePromises);

    // Step 3: Compute percentages for the target cell type
    const processedData = [];

    abundanceDataArray.forEach((abundanceData, speciesIndex) => {
      const { organism, organs, celltypes, detected } = abundanceData;

      // Find index of the target cell type
      const cellTypeIndex = celltypes.findIndex(ct => ct.toLowerCase() === cellType.toLowerCase());

      if (cellTypeIndex === -1) return; // Skip if the cell type isn't found

      // Loop through each organ and calculate percentage
      organs.forEach((organ, organIndex) => {
        if (detectedMatrix[organIndex][speciesIndex] === 0) return; // Skip if cell type isn't detected

        const totalCellsInOrgan = detected.reduce((sum, cellArray) => sum + cellArray[organIndex], 0);
        const targetCellCount = detected[cellTypeIndex][organIndex];

        if (totalCellsInOrgan > 0) {
          processedData.push({
            species: organism,
            organ: organ.toLowerCase(),
            percentage: (targetCellCount / totalCellsInOrgan) * 100,
          });
        }
      });
    });

    return { success: true, data: processedData };
  } catch (error) {
    console.error('Error fetching cell type distribution:', error);
    return { success: false, message: error.message, data: null };
  }
};

export { getCellTypeDistribution };
