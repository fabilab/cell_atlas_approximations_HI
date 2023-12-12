import atlasapprox from "@fabilab/atlasapprox";

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
        return organxorganismDic;

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
