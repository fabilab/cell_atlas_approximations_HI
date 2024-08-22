import React, { useState, useRef, useEffect } from 'react';
import ImageMapper from 'react-img-mapper';
import orgMeta from '../../utils/organismMetadata.js';
import { scaleLinear } from 'd3-scale';

const HighestMeasurement = ({ state }) => {
    const { organism, organs, average } = state;
    const imageRef = useRef(null);
    const [scalingFactors, setScalingFactors] = useState({ width: 1, height: 1 });

    // Compute the sum of average expression for each organ
    const organExpressionSum = {};
    organs.forEach((organ, index) => {
        if (!organExpressionSum[organ]) {
            organExpressionSum[organ] = 0;
        }
        organExpressionSum[organ] += average[index];
    });

    // Set up color scale
    const minExpression = Math.min(...Object.values(organExpressionSum));
    const maxExpression = Math.max(...Object.values(organExpressionSum));
    const colorScale = scaleLinear()
        .domain([minExpression, maxExpression])
        .range(["#dddcdc", "#e05028"]); // Light to dark blue

    // Adjust scaling factors based on image size
    useEffect(() => {
        const intrinsicDimensions = orgMeta[organism]?.intrinsicDimensions;
        const renderedWidth = imageRef.current?.clientWidth || 480;
        const renderedHeight = imageRef.current?.clientHeight || 480;

        setScalingFactors({
            width: renderedWidth / intrinsicDimensions.width,
            height: renderedHeight / intrinsicDimensions.height,
        });
    }, []);

    const areas = Object.keys(orgMeta[organism]?.organs || {}).map((organ) => {
        const coords = orgMeta[organism].organs[organ].coords.split(',').map(Number);
        const adjustedCoords = coords.map((coord, index) => 
            index % 2 === 0 ? coord * scalingFactors.width : coord * scalingFactors.height
        );

        // Identify if the current area is a label
        const isLabel = organ.includes("-label");

        return {
            id: organ,
            name: organ,
            shape: orgMeta[organism].organs[organ].shape || 'poly',
            coords: adjustedCoords,
            fillColor: isLabel ? "transparent" : colorScale(organExpressionSum[organ] || 0),
            preFillColor: isLabel ? "transparent" : colorScale(organExpressionSum[organ] || 0),
            strokeColor: "transparent",
        };
    });

    const renderImageMap = () => {
        return (
            <ImageMapper
                ref={imageRef}
                src={require(`../../asset/anatomy/grey_${organism}.jpg`)}
                map={{ name: `${organism}-map`, areas: areas }}
                width={480}
                height={480}
            />
        );
    };

    return (
        <div style={{ padding: "0% 3%", display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ position: 'relative', width: '100%', height: 'auto' }}>
                {renderImageMap()}
            </div>
        </div>
    );
};

export default HighestMeasurement;
