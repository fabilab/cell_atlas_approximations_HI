import React, { useState, useEffect, useRef } from 'react';
import orgMeta from '../../utils/organismMetadata.js'; 
import atlasapprox from "@fabilab/atlasapprox";
import ImageMapper from 'react-img-mapper';
import { Typography } from 'antd';
import OrganCellChart from './OrganCellChart.js';
const { Text } = Typography;

const OrganismProfile = ({ organism }) => {
    console.log(organism);
    const [error, setError] = useState(null);
    // const [organs, setOrgans] = useState({});
    const imageRef = useRef(null);
    const [imageHeight, setImageHeight] = useState(0);
    const [scalingFactors, setScalingFactors] = useState({ width: 0.4447, height: 0.4286 });  // scaling factors, rendered width/intrinsic width
    const [cellTypes, setCellTypes] = useState([]);
    const [clickedOrgan, setClickedOrgan] = useState(null);
    const [apiCellOrgan, setApiCellOrgan] = useState(null);
    
    const handleOrganClick = (area) => {
        let tempOrgan = area.name.split('-')[0]
        setClickedOrgan(tempOrgan);
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
                let apiResponse = await atlasapprox.celltypexorgan(organism, null, "gene_expression");
                setApiCellOrgan(apiResponse);
            } catch (error) {
                console.error("Error fetching cell types:", error);
            }
        };
        
        fetchCellTypes(); 
        fetchCellOrganData();
    };

    const handleImageLoad = (imageRef, parentDimensions) => {
        const naturalWidth = imageRef.naturalWidth;
        const naturalHeight = imageRef.naturalHeight;
        const renderedWidth = parentDimensions.width;
        const renderedHeight = parentDimensions.height;
    
        if (naturalWidth && naturalHeight && renderedWidth && renderedHeight) {
            const widthFactor = renderedWidth / naturalWidth;
            const heightFactor = renderedHeight / naturalHeight;
            
            setScalingFactors({ width: widthFactor, height: heightFactor });
        }
    };

    const renderImageMap = () => {
        if (!orgMeta[organism]?.organs) return null;
    
        const areas = Object.keys(orgMeta[organism].organs).map(organ => {
            const coords = orgMeta[organism].organs[organ].coords.split(',').map(Number);
            
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
                fillColor: "yellow",
            };
        });
    
        return ( 
            <ImageMapper 
                ref={imageRef}
                src={anatomyImage}
                map={{ name: `${organism}-map`, areas: areas }}
                onClick={(area, index, event) => handleOrganClick(area)}
                onLoad={handleImageLoad}
                width={350}
                stayHighlighted={true}
                height={450}
            />
        );
    };
    

    let imagePath = require(`../../asset/organisms/${organism}.jpeg`);
    let anatomyImage
    try {
        anatomyImage = require(`../../asset/anatomy/${organism}.jpeg`);
    } catch(error) {
        anatomyImage = require(`../../asset/anatomy/temp.jpeg`);
    }
    
    let bioName = orgMeta[organism]?.bioName || "Unknown";
    let commonName = orgMeta[organism]?.commonName || "Unknown";
    let dataSource = orgMeta[organism]?.dataSource || "Data source not available";
    let description = orgMeta[organism]?.about || "description not available";
    let descriptionHyperlink = orgMeta[organism]?.descriptionHyperlink || "hyperlink unavailable";
    let paperHyperlink = orgMeta[organism]?.paperHyperlink || "hyperlink unavailable";

    return (

        <div style={{  width: "inherit"}}>
            <div style={{display: "flex", alignItems: "center", backgroundColor: "rgb(30,41,56,0.13)", padding: "0% 5%"}}>
                {
                    imagePath &&
                    <img 
                        src={imagePath} 
                        alt={organism} 
                        style={{width: "8%", height: "auto", paddingRight: "8%"}}
                    />
                }
                <div>
                    <h2 style={{fontSize: "1.3em"}}>{bioName}</h2>
                    <p >Common name: {commonName}</p>
                    <p>Data source: <a href={paperHyperlink} style={{color: '#0958d9'}} target="_blank" rel="noopener noreferrer">{dataSource}</a></p>
                </div>
            </div>
            <div style={{padding: "1% 5%"}}>
                <h3>About</h3>
                <p style={{textAlign: "justify", fontFamily:"PT Serif"}}>{description} <a href={descriptionHyperlink} target="_blank">"From Wikipedia"</a></p>
            </div>
            <div style={{padding: "1% 5%"}}>
                <h3>Organ Map</h3>
                <div style={{ padding: "0% 3%", display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, overflow: 'auto', minWidth: '0' }}>
                        {renderImageMap()}
                        <Text>Hover over and click on organs to view more detail</Text>
                    </div>
                    <div style={{ flex: 1.5, overflow: 'auto', minWidth: '0' }}>
                        {/* Render the chart for a specific organ, say "Heart" */}
                        {apiCellOrgan && clickedOrgan && <OrganCellChart apiCellOrgan={apiCellOrgan} organName={clickedOrgan} />}
                    </div>
                </div>
            </div>
            <div style={{padding: "1% 5%"}}>
                <h3>Suggested Query</h3>
                
            </div>
        </div>
    );
};

export default OrganismProfile;
