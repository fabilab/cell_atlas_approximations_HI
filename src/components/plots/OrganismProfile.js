import organismMapping from '../../utils/organismMapping.js';


const OrganismProfile = ({ organism }) => {
    console.log(organism);

    let imagePath = require(`../../asset/organisms/${organism}.jpeg`)
    let biologicalName = organismMapping[organism].biologicalName || "Unknown";
    let commonName = organismMapping[organism].commonName || "Unknown";
    console.log(biologicalName);
    return (
        <div style={{ padding: "20px", width: "80%", border: "1px solid grey"}}>
            <div style={{display: "flex", alignItems: "center", marginBottom: "20px"}}>
                <img src={imagePath} alt={organism} style={{marginRight: "20px", width: "15%", height: "15%"}} />
                <div>
                    <h4>Biological name: {biologicalName}</h4>
                    <h4>Common name: {commonName}</h4>
                </div>
            </div>
        </div>
    );
    };

export default OrganismProfile;