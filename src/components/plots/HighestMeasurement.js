import React, { useState, useRef, useEffect } from 'react';
import ImageMapper from 'react-img-mapper';
import Plot from 'react-plotly.js';
import orgMeta from '../../utils/organismMetadata.js';
import { scaleLinear } from 'd3-scale';
import { Typography } from 'antd';
const { Text } = Typography;

const HighestMeasurement = ({ state }) => {
    const { feature, organism, organs, celltypes, average, fractions } = state;
    const imageRef = useRef(null);
    const [scalingFactors, setScalingFactors] = useState({ width: 1, height: 1 });
    const [hoveredOrgan, setHoveredOrgan] = useState(null);
    const [barChartData, setBarChartData] = useState([]);

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
        .range(["#e6f1fc", "#2488ed"]);

    // Adjust scaling factors based on image size
    useEffect(() => {
        const intrinsicDimensions = orgMeta[organism]?.intrinsicDimensions;
        const updateScalingFactors = () => {
            const renderedWidth = imageRef.current?.clientWidth || 480;
            const renderedHeight = imageRef.current?.clientHeight || 480;

            setScalingFactors({
                width: renderedWidth / intrinsicDimensions.width,
                height: renderedHeight / intrinsicDimensions.height,
            });
        };

        // Call the function initially and add an event listener for window resizing
        updateScalingFactors();
        window.addEventListener('resize', updateScalingFactors);

        return () => {
            window.removeEventListener('resize', updateScalingFactors);
        };
    }, [organism]);

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
                onMouseEnter={(area) => handleMouseEnter(area)}
                width={480}
                height={480}
            />
        );
    };

    // When user hovers over an organ, show a bar chart
    const handleMouseEnter = (area) => {
        setHoveredOrgan(area.name);

        // Prepare data for the bar chart based on the hovered organ
        const organData = organs.map((organ, index) => {
            if (organ === area.name) {
                return { cellType: celltypes[index], avgExpression: average[index] };
            }
            return null;
        }).filter(item => item !== null);

        setBarChartData(organData);
    };

    const renderBarChart = () => {
        if (!hoveredOrgan || !barChartData.length) return null;

        const cellTypes = barChartData.map(item => item.cellType);
        const avgExpressions = barChartData.map(item => item.avgExpression);
        
        return (
            <Plot
                data={[
                    {
                        type: 'bar',
                        x: avgExpressions,
                        y: cellTypes,
                        orientation: 'h',
                    }
                ]}
                layout={{ 
                    title: `Average expression of ${feature} in ${organism} ${hoveredOrgan}`,
                    width: 450,  // Adjust the width here
                    yaxis: {
                        automargin: true,  // Ensure margin is handled well for long labels
                        categoryorder: 'total ascending',  // Order categories by total value descending
                    },
                    xaxis: {
                        autorange: true,  // Ensure the x-axis adjusts according to the data
                    },
                }}
            />
        );
    };

    return (
        <div style={{ padding: "0% 1%", display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1, overflow: 'auto', minWidth: '0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {renderImageMap()}
                <Text style={{ alignSelf: 'center' }}>* Hover over an organ for cell type information.</Text>
            </div>
            <div style={{ flex: 1, overflow: 'auto', minWidth: '0' }}>
                {renderBarChart()}
            </div>
        </div>
    );
};

export default HighestMeasurement;
