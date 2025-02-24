import atlasapprox from "@fabilab/atlasapprox";

/**
 * Fetches the distribution of a given cell type across species and organs
 * @param {string} cellType - The cell type to analyze (e.g., "macrophage")
 * @returns {Promise<Object>} Processed data for visualization
 */
const getCellTypeDistribution = async (celltype) => {
  try {
    // 1: Find which species contain the cell type
    const presenceData = await atlasapprox.organxorganism({ celltype: celltype });

    if (!presenceData || !presenceData.organisms.length) {
      return { success: false, message: `No species found containing ${celltype}`, data: null };
    }

    const organismList = presenceData.organisms;

    // 2: Fetch abundance data for each species using celltypexorgan
    const speciesAbundance = organismList.map(organism =>
      atlasapprox.celltypexorgan({
        organism,
        measurement_type: "gene_expression",
      })
    );

    const abundanceDataArray = await Promise.all(speciesAbundance);
    // 3: Compute percentages for the target cell type
    const processedData = [];

    abundanceDataArray.forEach((abundanceData, speciesIndex) => {
      const { organism, organs, celltypes, detected } = abundanceData;

      // Find index of the target cell type
      const cellTypeIndex = celltypes.findIndex(ct => ct.toLowerCase() === celltype.toLowerCase());

      if (cellTypeIndex === -1) return;

      // Loop through each organ and calculate percentage
      organs.forEach((organ, organIndex) => {
        const targetCellCount = detected[cellTypeIndex][organIndex];
        const totalCellsInOrgan = detected.reduce((sum, cellArray) => sum + cellArray[organIndex], 0);

        if (totalCellsInOrgan > 0 && targetCellCount > 0) {
          processedData.push({
            organism: organism,
            organ: organ.toLowerCase(),
            percentage: (targetCellCount / totalCellsInOrgan) * 100,
          });
        }
      });
    });

    // Remove organs with 0% of the selected cell type across all speciess
    // Step 4: Remove organs with 0% across all species
    const organSums = processedData.reduce((acc, { organ, percentage }) => {
      acc[organ] = (acc[organ] || 0) + percentage;
      return acc;
    }, {});

    const validOrgans = Object.keys(organSums).filter((organ) => organSums[organ] > 0);

    // Step 5: Keep only valid organs
    const cleanedData = processedData.filter(({ organ }) => validOrgans.includes(organ));


    return { success: true, data: cleanedData };
  } catch (error) {
    console.error('Error fetching cell type distribution:', error);
    return { success: false, message: error.message, data: null };
  }
};

export { getCellTypeDistribution };
