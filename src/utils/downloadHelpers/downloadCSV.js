// Code generated with assistance from ChatGPT

export const downloadCSV = ( plotState ) => {

    const { source_organism, target_organism, queries, targets, distances } = plotState;
    
    let csvContent = `Queried organism,${source_organism}\nTarget organism,${target_organism}\n\nQueried genes,Target genes,Distances\n`;
    for (let i = 0; i < queries.length; i++) {
      csvContent += `${queries[i]},${targets[i]},${distances[i]}\n`;
    }
  
    // Create a link to download the CSV
    const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${csvContent}`);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `homologs_${source_organism}_to_${target_organism}.csv`);
    document.body.appendChild(link);
  
    // Simulate click to trigger download
    link.click();
    document.body.removeChild(link); // Cleanup
  };
  