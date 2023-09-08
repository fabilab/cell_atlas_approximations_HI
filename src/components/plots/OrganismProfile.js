import React, { useState, useEffect } from 'react';
import organismMapping from '../../utils/organismMapping.js';
import atlasapprox from "@fabilab/atlasapprox";
import ImageMapper from 'react-img-mapper';

const OrganismProfile = ({ organism }) => {
    const [error, setError] = useState(null);
    const [organs, setOrgans] = useState({});

    const handleOrganClick = (organ) => {
        console.log(`Console log: You clicked on the ${organ.name}`);
        alert(`Alert: You clicked on the ${organ.name}`);
    };

    const renderImageMap = () => {
        if (!organismMapping[organism]?.organs) return null;

        const areas = Object.keys(organismMapping[organism].organs).map(organ => ({
            id: organ,
            name: organ,
            shape: 'poly',
            coords: organismMapping[organism].organs[organ].coords.split(',').map(Number),
            preFillColor: "transparent",
            fillColor: "yellow"
        }));

        return (
            <ImageMapper 
                src={anatomyImage}
                map={{ name: `${organism}-map`, areas: areas }}
                onClick={(area, index, event) => handleOrganClick(area)}
                natural={true}
                width={600}
                style={{ border: '1px solid red' }}  // just to visualize its boundaries
            />
        );
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!organism) {
                setError('Organism is unknown.');
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

    let imagePath = require(`../../asset/organisms/${organism}.jpeg`);
    let anatomyImage = require(`../../asset/anatomy/${organism}.jpeg`);

    let biologicalName = organismMapping[organism]?.biologicalName || "Unknown";
    let commonName = organismMapping[organism]?.commonName || "Unknown";
    let dataSource = organismMapping[organism]?.dataSource || "Data source not available";
    let description = organismMapping[organism]?.about || "description not available";

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
                {/* Organism's image  */}
                <div style={{display: "flex", flexWrap: "wrap"}}>
                    {renderImageMap()}
                </div>
            </div>
        </div>
    );
};

export default OrganismProfile;
