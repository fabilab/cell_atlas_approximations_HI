export const downloadFasta = (props) => {

    let organism = props.organism;
    let features = props.features;
    let sequences = props.sequences;
    let type = props.type;

    // Formatting content for the .txt file
    let fastaContent = '';
    for (let i = 0; i < features.length; i++) {
        fastaContent += `>${features[i]} | ${organism} | ${type}\n`;
        fastaContent += `${sequences[i]}\n`;
    }

    // https://stackoverflow.com/questions/19327749/javascript-blob-filename-without-link
    // Creating a blob of the content
    const blob = new Blob([fastaContent], { type: "text/plain" });

    // Create a link element
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "sequences.fasta";  // You can customize the filename here

    // Trigger the download
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};
