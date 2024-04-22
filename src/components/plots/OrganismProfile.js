import React, { useState, useRef, useEffect } from 'react';
import orgMeta from '../../utils/organismMetadata.js'; 
import atlasapprox from "@fabilab/atlasapprox";
import ImageMapper from 'react-img-mapper';
import { Typography } from 'antd';
import OrganCellChart from './OrganCellChart.js';
const { Text } = Typography;

const OrganismProfile = ({ state }) => {
    let { organism, organs, measurement_type } = state;

    const imageRef = useRef(null);
    const [scalingFactors, setScalingFactors] = useState({ width: 1, height: 1 });
    const [clickedOrgan, setClickedOrgan] = useState(null);
    const [apiCellOrgan, setApiCellOrgan] = useState(null);
    const [imagePath, setImagePath] = useState(null);
    const [bioName, setBioName] = useState("Unknown");
    const [commonName, setCommonName] = useState("Unknown");
    const [dataSource, setDataSource] = useState("Data source not available");
    const [description, setDescription] = useState("Description not available");
    const [descriptionHyperlink, setDescriptionHyperlink] = useState("Hyperlink unavailable");
    const [paperHyperlink, setPaperHyperlink] = useState("Hyperlink unavailable");
    const [loading, setLoading] = useState(true);
    let params = {};

    const fetchOrganData = async () => {
        let numOrgans = organs.length;
        let organismImagePath = require(`../../asset/organisms/${organism}.jpeg`);
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
            const intrinsicDimensions = orgMeta[organism]?.intrinsicDimensions;
            if (intrinsicDimensions) {
                const renderedSize = 480;
                setScalingFactors({
                    width: renderedSize / intrinsicDimensions.width,
                    height: renderedSize / intrinsicDimensions.height,
                });
            }
        }
        setImagePath(organismImagePath);
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
                    // style={{width: "8%", height: "auto", paddingRight: "8%"}}
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
            <ImageMapper 
                ref={imageRef}
                map={{ name: `${organism}-map`, areas: areas }}
                onMouseEnter={(area, index, event) => handleOrganClick(area)}
                onLoad={handleImageLoad}
                width={480}
                stayHighlighted={true}
                height={480}
            />
        );
    };

    return (
        <div style={{  width: "inherit"}}>
            <div style={{display: "flex", alignItems: "center", backgroundColor: "rgb(30,41,56,0.13)", padding: "0% 3%"}}>
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
                    <p>Data source: <a href={paperHyperlink} style={{color: '#0958d9'}} target="_blank" rel="noreferrer">{dataSource}</a></p>
                </div>
            </div>
            <div style={{padding: "1% 3%"}}>
                <h3>About</h3>
                <p style={{textAlign: "justify", fontFamily:"PT Serif"}}>{description} <a href={descriptionHyperlink} target="_blank" rel="noreferrer">"From Wikipedia"</a></p>
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
