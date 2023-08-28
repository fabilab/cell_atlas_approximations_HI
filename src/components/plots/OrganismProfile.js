import React, { useState, useEffect } from 'react';
import organismMapping from '../../utils/organismMapping.js';
import atlasapprox from "@fabilab/atlasapprox";


const OrganismProfile = ({ organism }) => {

    const [apiOrgans, setOrgans] = useState({ organs: [] });
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchData = async () => {
            if (!organism) {
                setError('Organism is unknown.'); // Handling undefined organism
                return;
            }
            try {
                const result = await atlasapprox.organs(organism);
                setOrgans(result);
            } catch (error) {
                setError('API call failed.');
            }
        };

        fetchData();
    }, [organism]);

    if (error) {
        return (
            <div style={{ padding: "3%", width: "85%", boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)'}}>
                <p>{error}</p>
            </div>
        );
    }

    let imagePath = null;
    try {
        imagePath = require(`../../asset/organisms/${organism}.jpeg`);
    } catch (error) {
        
    }
    
    let biologicalName = organismMapping[organism]?.biologicalName || "Unknown";
    let commonName = organismMapping[organism]?.commonName || "Unknown";
    let dataSource = organismMapping[organism]?.dataSource || "Data source not available";
    let description = organismMapping[organism]?.about || "desciption not available";

    // Extracting link text and URL from the dataSource string
    const linkText = dataSource.match(/\[(.*?)\]/)?.[1];
    const url = dataSource.match(/\((.*?)\)/)?.[1];
    return (
        <div style={{ padding: "3%", width: "85%", boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)'}}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px"}}>
                <div>
                    <h2>{biologicalName} Cell Atlas</h2>
                    <p>Common name: {commonName}</p>
                    <p>Data source / Paper: <a href={url} style={{color: 'blue'}} target="_blank" rel="noopener noreferrer">{linkText}</a></p>
                </div>
                {
                    imagePath &&
                    <img 
                        src={imagePath} 
                        alt={organism} 
                        style={{width: "12%", height: "auto", borderRadius:"50%"}}
                    />
                }
            </div>
            <div style={{marginTop: "20px"}}>
                <h4>About</h4>
                <p style={{textAlign: "justify"}}>{description}</p>
            </div>
            <div style={{marginTop: "20px"}}>
                <h4>Tissues</h4>
                <div style={{display: "flex", flexWrap: "wrap"}}>
                {apiOrgans.organs && apiOrgans.organs.map(o => (
                    <div key={o} style={{ textAlign: 'center', margin: '0px 0'}}>
                        {o}
                    </div>
                ))}
            </div>
            </div>
        </div>
    );
};

export default OrganismProfile;
