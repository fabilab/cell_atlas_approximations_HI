
//  
export const downloadTable = (state, plotType) => {
    let rows, cols, detected, csvContent, filename;
    if (plotType === 'celltypeXorgan') {
        rows = state.celltypes;
        cols = state.organs;
        detected = state.detected;
        csvContent = 'data:text/csv;charset=utf-8,Cell types / Organ,' + cols.join(',') + '\n';
        filename = `${state.organism}_celltypexorgan`
    } else if (plotType === 'organXorganism') {
        rows = state.organs;
        cols = state.organisms;
        detected = state.detected;
        csvContent = 'data:text/csv;charset=utf-8,Organs / Organ,' + cols.join(',') + '\n';
        filename = `${state.celltype}_organxorganism`
    }

    // Add the data rows
    for (let i = 0; i < rows.length; i++) {
        csvContent += rows[i] + ',' + detected[i].join(',') + '\n';
    }

    // Create a link to download the CSV
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link); // Required for FF

    // Simulate click to trigger download
    link.click();
}