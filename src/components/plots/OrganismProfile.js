import React, { useState, useEffect } from 'react';
import orgMeta from '../../utils/organismMetadata.js'; 
import atlasapprox from "@fabilab/atlasapprox";
import ImageMapper from 'react-img-mapper';
import { Typography } from 'antd';
import OrganCellChart from './OrganCellChart.js';
import { scaleImage } from '../../utils/plotHelpers/scaleImage.js';
const { Text } = Typography;

const OrganismProfile = ({ state }) => {
    let { organism, organs, measurement_type } = state;

    const [scalingFactors, setScalingFactors] = useState({ width: 1, height: 1 });
    const [clickedOrgan, setClickedOrgan] = useState(null);
    const [apiCellOrgan, setApiCellOrgan] = useState(null);
    const [imagePath, setImagePath] = useState(null);
    const [bioName, setBioName] = useState("Unknown");
    const [commonName, setCommonName] = useState("Unknown");
    const [dataSource, setDataSource] = useState(null);
    const [description, setDescription] = useState("Description not available");
    const [descriptionHyperlink, setDescriptionHyperlink] = useState("Hyperlink unavailable");
    const [paperHyperlink, setPaperHyperlink] = useState("Hyperlink unavailable");
    const [loading, setLoading] = useState(true);
    let params = {};

    // fetch cell type abundance data for organism with single organ
    const fetchOrganData = async () => {
        let numOrgans = organs.length;
        let organismImagePath = require(`../../asset/organisms/${organism}.jpeg`);
        setImagePath(organismImagePath);
        if (numOrgans < 2) {
            try {
                params = {
                    organism: organism,
                    organ: null,
                    measurement_type: measurement_type
                }
                let apiResponse = await atlasapprox.celltypexorgan(params);
                setApiCellOrgan(apiResponse);
                setClickedOrgan(apiResponse.organs[0]);
            } catch (error) {
                console.error("Error fetching cell types:", error);
            }
        } else {
            let imageWithDimensions = require(`../../asset/anatomy/${organism}.jpg`);
            scaleImage(imageWithDimensions, 480, setScalingFactors)
        }
    }

    useEffect(() => {
        if (organism) {
            setLoading(true); // Set loading to true when organism changes
            setClickedOrgan(null); // Clear previous clicked organ
            setApiCellOrgan(null); // Clear previous API data
            
            fetchOrganData();
            
            setBioName(orgMeta[organism]?.bioName || "Unknown");
            setCommonName(orgMeta[organism]?.commonName || "Unknown");
            setDataSource(orgMeta[organism]?.dataSource || "Data source not available");
            setDescription(orgMeta[organism]?.about || "Description not available");
            setDescriptionHyperlink(orgMeta[organism]?.descriptionHyperlink || "Hyperlink unavailable");
            setPaperHyperlink(orgMeta[organism]?.paperHyperlink || "Hyperlink unavailable");

            setLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [organism]);

    const handleOrganClick = (area) => {
        let tempOrgan = area.name.split('-')[0]
        setClickedOrgan(tempOrgan);

        const fetchCellOrganData = async () => {
            try {
                params = {
                    organism: organism,
                    organ: null,
                    measurement_type: measurement_type,
                }
                let apiResponse = await atlasapprox.celltypexorgan(params);
                setApiCellOrgan(apiResponse);
            } catch (error) {
                console.error("Error fetching cell types:", error);
            }
        };
        
        fetchCellOrganData();
    };

    const handleImageLoad = (imageRef, parentDimensions) => {
        try {
            let organismAnatomyImage;
            if(measurement_type === 'chromatin_accessibility') {
                organismAnatomyImage = require(`../../asset/anatomy/${organism}_chromatin.jpg`);
            } else {
                organismAnatomyImage = require(`../../asset/anatomy/${organism}.jpg`);
            }
            imageRef.src = organismAnatomyImage;
        } catch (error) {
            console.error("Error updating image:", error);
            const tempAnatomyImage = require(`../../asset/anatomy/temp.jpeg`);
            imageRef.src = tempAnatomyImage;
        }
    };

    const renderImageMap = () => {
        
        if (loading) return null;

        // whole organism, no organ
        if (!orgMeta[organism]?.organs) {
            return (
                <img 
                    src={imagePath} 
                    alt={organism} 
                    width={350}
                    height={350}
                />
            );
        }
    
        const areas = Object.keys(orgMeta[organism].organs)
            .filter(organ => organs.includes(organ.includes('-') ? organ.split('-')[0] : organ))
            .map(organ => {
            const coords = orgMeta[organism].organs[organ].coords.split(',').map(Number);
            const shape = orgMeta[organism].organs[organ].shape || 'poly';
            
            let isOrganLabel = organ.split("-")[1] === "label";
            // Adjust the coordinates using the scaling factors
            const adjustedCoords = coords.map((coord, index) => 
                index % 2 === 0 ? coord * scalingFactors.width : coord * scalingFactors.height
            );
    
            return {
                id: organ,
                name: organ,
                shape: shape,
                coords: adjustedCoords,
                preFillColor: "transparent",
                fillColor: isOrganLabel ? "rgba(255,250,0, 0.4)" : "yellow",
                strokeColor: "transparent",
            };
        });
    
        return ( 
            // eslint-disable-next-line
            <ImageMapper 
                map={{ name: `${organism}-map`, areas: areas }}
                onMouseEnter={(area) => handleOrganClick(area)}
                onLoad={handleImageLoad}
                width={480}
                stayHighlighted={true}
                height={480}
            />
        );
    };

    const renderDataSource = () => {
        if (Array.isArray(dataSource) && Array.isArray(paperHyperlink)) {
            return (
                <div>
                    <p>Data source:</p>
                    {dataSource.map((source, index) => (
                        <p key={index}>
                            <a href={paperHyperlink[index]} style={{color: '#127ee3', textDecoration: "none"}} target="_blank" rel="noreferrer">
                                {source}
                            </a>
                        </p>
                    ))}
                </div>
            );
        } else {
            return (
                <div>
                    <p>Data source:</p>
                    <p>
                        <a href={paperHyperlink} style={{color: '#127ee3', textDecoration: "none"}} target="_blank" rel="noreferrer">{dataSource}</a>
                    </p>
                </div>
            );
        }
    };

    return (
        <div style={{  width: "inherit"}}>
            <div
                style={{
                display: "flex",
                alignItems: "flex-start",
                backgroundColor: "#f5f5f5",
                padding: "2% 3% 0% 3%",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
            >
                {imagePath && (
                <img
                    src={imagePath}
                    alt={organism}
                    style={{
                    width: "120px",
                    height: "auto",
                    marginRight: "24px",
                    borderRadius: "4px",
                    objectFit: "cover",
                    }}
                />
                )}
                <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: "1.1em", margin: "0 0 8px 0" }}>
                        {bioName}
                    </h2>
                    <p style={{ fontSize: "1em"}}>
                        Common name: {commonName}
                    </p>
                    <div style={{ fontSize: "1em" }}>
                        {renderDataSource()}
                    </div>
                </div>
            </div>
            <div style={{ padding: "1% 3%" }}>
                <h3>About</h3>
                <p>
                {description}{" "}
                <a
                    href={descriptionHyperlink}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#127ee3", textDecoration: "none" }}
                >
                    "From Wikipedia"
                </a>
                </p>
            </div>
            <div style={{ padding: "1% 3%" }}>
                <h3>Organ Map</h3>
                <div style={{ padding: "0% 3%", display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, overflow: 'auto', minWidth: '0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {renderImageMap()}
                        <Text style={{ alignSelf: 'center' }}>* Hover over an organ for cell type information.</Text>
                    </div>
                    <div style={{ flex: 1, overflow: 'auto', minWidth: '0' }}>
                        {apiCellOrgan && clickedOrgan && 
                            <OrganCellChart 
                                state={{
                                    plotLocation: "organismProfile",
                                    apiCellOrgan:apiCellOrgan,
                                    organName:clickedOrgan,
                                    measurementType:measurement_type,
                                }}
                            />
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrganismProfile;
