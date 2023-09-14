import React, { useState, useEffect, useRef } from 'react';
import organismMapping from '../../utils/organismMapping.js';
import atlasapprox from "@fabilab/atlasapprox";
import ImageMapper from 'react-img-mapper';
import { Col, Row, List, Divider, Typography } from 'antd';

const OrganismProfile = ({ organism }) => {
    const [error, setError] = useState(null);
    const [organs, setOrgans] = useState({});
    const imageRef = useRef(null);
    const [detectedValues, setDetectedValues] = useState([]);
    const [imageHeight, setImageHeight] = useState(0);
    const [scalingFactors, setScalingFactors] = useState({ width: 0.508, height: 0.508 });  // scaling factors, inspect webpage page and update here if the image size has changed
    const [cellTypes, setCellTypes] = useState([]);
    const [clickedOrgan, setClickedOrgan] = useState(null);
    
    const handleOrganClick = (area) => {
        let tempOrgan = area.name.split('-')[0]
        setClickedOrgan(tempOrgan);
        console.log(clickedOrgan);
        const fetchCellTypes = async () => {
            try {
                let apiCelltypes = await atlasapprox.celltypes(organism, tempOrgan, "gene_expression");
                setCellTypes(apiCelltypes.celltypes);
            } catch (error) {
                console.error("Error fetching cell types:", error);
            }
        };

        const fetchCellOrganData = async () => {
            try {
                let apiCellOrgan = await atlasapprox.celltypexorgan(organism, null, "gene_expression");
                console.log(clickedOrgan);
                let organIndex = apiCellOrgan.organs.indexOf(clickedOrgan);
                if (organIndex === -1) {
                    console.error("Organ not found in the data.");
                    return;
                }
                const values = apiCellOrgan.detected.map(cellTypeData => cellTypeData[organIndex]);
                setDetectedValues(values); // Update state with the detected values
            } catch (error) {
                console.error("Error fetching cell types:", error);
            }
        };
        fetchCellTypes(); 
        fetchCellOrganData();
    };

    useEffect(() => {
        console.log(detectedValues);
    }, [detectedValues]);

    const handleImageLoad = (event) => {
        const naturalWidth = event?.target?.naturalWidth;
        const naturalHeight = event?.target?.naturalHeight;
        const renderedWidth = event?.target?.width;
        const renderedHeight = event?.target?.height;

        if (naturalWidth && naturalHeight && renderedWidth && renderedHeight) {
            const widthFactor = renderedWidth / naturalWidth;
            const heightFactor = renderedHeight / naturalHeight;
            
            setScalingFactors({ width: widthFactor, height: heightFactor });
        }
        if (imageRef.current) {
            setImageHeight(imageRef.current.offsetHeight);
        }
    };

    const renderImageMap = () => {
        if (!organismMapping[organism]?.organs) return null;

        const areas = Object.keys(organismMapping[organism].organs).map(organ => {
            const coords = organismMapping[organism].organs[organ].coords.split(',').map(Number);
            
            // Adjust the coordinates using the scaling factors
            const adjustedCoords = coords.map((coord, index) => 
                index % 2 === 0 ? coord * scalingFactors.width : coord * scalingFactors.height
            );

            return {
                id: organ,
                name: organ,
                shape: 'poly',
                coords: adjustedCoords,
                preFillColor: "transparent",
                fillColor: "rgb(255,255,0,0.8)",
            };
        });

        return (
            <ImageMapper 
                ref={imageRef}
                src={anatomyImage}
                map={{ name: `${organism}-map`, areas: areas }}
                onClick={(area, index, event) => handleOrganClick(area)}
                onLoad={handleImageLoad}  // Added onLoad event to compute scaling factors
                width={350}
                stayHighlighted={true}
                height={450}
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

    const url = dataSource.match(/\((.*?)\)/)?.[1];

    return (

        <div style={{  width: "inherit"}}>
            <div style={{display: "flex", alignItems: "center", backgroundColor: "rgb(30,41,56,0.13)", padding: "0% 5%"}}>
                {
                    imagePath &&
                    <img 
                        src={imagePath} 
                        alt={organism} 
                        style={{width: "9%", height: "auto", paddingRight: "8%"}}
                    />
                }
                <div>
                    <h2 style={{fontSize: "1.3em"}}>{biologicalName} Cell Atlas</h2>
                    <h5>Common name: {commonName}</h5>
                    <h5>Data source: <a href={url} style={{color: '#0958d9'}} target="_blank" rel="noopener noreferrer">{dataSource}</a></h5>
                </div>
            </div>
            <div style={{padding: "1% 5%"}}>
                <h3>About</h3>
                <p style={{textAlign: "justify", fontFamily:"PT Serif"}}>{description}</p>
            </div>
            <div style={{padding: "1% 5%", backgroundColor:"lavender"}}>
                <h3>Tissue Anatomy</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1.5, overflow: 'auto', marginRight: '10px' }}>
                        {renderImageMap()}
                    </div>
                    
                    
                </div>
            </div>
        </div>
    );
};

export default OrganismProfile;
