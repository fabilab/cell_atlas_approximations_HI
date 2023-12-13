import atlasapprox from "@fabilab/atlasapprox";

// Helper function generates by ChatGPT: to remove rows & cols with all zeros ()
function transformData(myDict) {
    let organs = myDict.organs;
    let organisms = myDict.organisms;
    let detected = myDict.detected;

    // Identify columns and rows with all zeros
    let columnsToRemove = new Set();
    let rowsToRemove = new Set();

    for (let i = 0; i < detected.length; i++) {
        let allZeroRow = detected[i].every(val => val === 0);
        if (allZeroRow) {
            rowsToRemove.add(i);
        }
    }

    for (let j = 0; j < organisms.length; j++) {
        let allZeroColumn = detected.every(row => row[j] === 0);
        if (allZeroColumn) {
            columnsToRemove.add(j);
        }
    }

    // Remove the identified rows and columns
    organs = organs.filter((_, index) => !rowsToRemove.has(index));
    organisms = organisms.filter((_, index) => !columnsToRemove.has(index));
    detected = detected.filter((_, rowIndex) => !rowsToRemove.has(rowIndex))
        .map(row => row.filter((_, colIndex) => !columnsToRemove.has(colIndex)));

    return { ...myDict, organs, organisms, detected };
}


export const getOrganxOrganism = async (celltype, measurementType) => {

    // the dimension of detected should be: detected(40)[Array(19),Array(19),Array(19)];
    // indicating the presence (1) or absence (0) of the cell type.
    let organxorganismDic = { celltype: celltype, organisms: [], organs: [], detected: {}, measurementType: measurementType};
    try {
        const allSpecies = (await atlasapprox.organisms("gene_expression")).organisms;
        organxorganismDic['organisms'] = allSpecies;

        let detectedMap = {}
        const organsPromises = allSpecies.map(async (species, speciesIndex) => {
            const organs = (await atlasapprox.organs({organism: species, measurement_type: "gene_expression"})).organs;
            
            for (const organ of organs) {
                if (!organxorganismDic['organs'].includes(organ)) {
                    organxorganismDic['organs'].push(organ);
                    // Initialize array for new organ
                    detectedMap[organ] = new Array(allSpecies.length).fill(0);
                }
                
                const celltypesPromises = await atlasapprox.celltypes({organism: species, organ: organ,measurement_type: measurementType});
                let celltypes = celltypesPromises.celltypes;
                if (celltypes.includes(celltype)) {
                    detectedMap[organ][speciesIndex] = 1;
                } 
            }
        });

        // Wait for all the Promises from the map to resolve
        await Promise.all(organsPromises);
        organxorganismDic['detected'] = Object.values(detectedMap);
        let finalData = transformData(organxorganismDic)
        return finalData;

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
