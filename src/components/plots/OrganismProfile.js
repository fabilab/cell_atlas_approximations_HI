import organismMapping from '../../utils/organismMapping.js';

const OrganismProfile = ({ organism }) => {
    console.log(organism);

    let imagePath = require(`../../asset/organisms/${organism}.jpeg`);
    let biologicalName = organismMapping[organism]?.biologicalName || "Unknown";
    let commonName = organismMapping[organism]?.commonName || "Unknown";
    let dataSource = organismMapping[organism]?.dataSource || "Data source not available";

    // Extracting link text and URL from the dataSource string
    const linkText = dataSource.match(/\[(.*?)\]/)?.[1];
    const url = dataSource.match(/\((.*?)\)/)?.[1];

    console.log(biologicalName);

    return (
        <div style={{ padding: "20px", width: "80%", border: "1px solid grey"}}>
            <div style={{display: "flex", alignItems: "center", marginBottom: "20px"}}>
                <img 
                    src={imagePath} 
                    alt={organism} 
                    style={{marginRight: "10%", width: "17%", height: "17%"}}
                />
                <div>
                    <h2>{biologicalName} Cell Atlas</h2>
                    <p>Common name: {commonName}</p>
                    <p>Data source / Paper: <a href={url} style={{color: 'blue'}} target="_blank" rel="noopener noreferrer">{linkText}</a></p>
                </div>
            </div>
        </div>
    );
};

export default OrganismProfile;
