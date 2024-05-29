import React from "react";
import Plot from "react-plotly.js";
import { useChat } from '../ChatContext'; 
import {selectAll} from "d3";
import { Typography } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
const { Link, Paragraph } = Typography;


// A function to define graph line thickness based on distance: shorter distance results in a thicker line
// d: distance
const getLineStyle = (d) => {
  switch (true) {
    case d >= 0 && d <= 5:
      return { width: 5, dash: "solid" };
    case d > 5 && d <= 10:
      return { width: 4, dash: "solid" };
    case d > 10 && d <= 20:
      return { width: 3, dash: "solid" };
    case d > 20 && d <= 30:
      return { width: 2, dash: "solid" };
    case d > 30 && d <= 40:
      return { width: 1, dash: "solid" };
    case d > 40:
      return { width: 1, dash: "dot" };
    default:
      return { width: 1, dash: "solid" }; // Default thickness
  }
};

const HomologsGraph = ({ state }) => {
  let {
    features,
    source_organism,
    target_organism,
    queries,
    targets,
    distances,
  } = state;
  const { setLocalMessage } = useChat();
  // Convert the features string to an array
  const featureArray = features.split(",");

  // Filter and arrange queries and targets based on featureArray order
  const orderedQueries = [];
  const orderedTargets = [];
  const orderedDistances = [];
  // a dictionary to keep track of the homologs counts for each queried gene.
  const featureTargetCount = {};

  featureArray.forEach((feature) => {
    let displayTargetCounts = 0;
    let totalTargetCounts = 0;
    const featureGroup = [];
    for (let index = 0; index < queries.length; index++) {
      const query = queries[index];
      if (query === feature) {
        // restrict the display homologs number to 5
        if (displayTargetCounts <= 4) {
          featureGroup.push({
            query,
            target: targets[index],
            distance: distances[index],
          });
          displayTargetCounts += 1;
        }
        totalTargetCounts += 1;
      }
      featureTargetCount[feature] = totalTargetCounts;
    }

    // Sort the group by distance in increasing order
    featureGroup.sort((a, b) => a.distance - b.distance);

    if (totalTargetCounts > 5) {
      featureGroup.push({
        query: feature,
        target: `[...${totalTargetCounts - 5} more]`,
        distance: 0,
      });
    }

    // Add sorted group to ordered arrays
    featureGroup.forEach((item) => {
      orderedQueries.push(item.query);
      orderedTargets.push(item.target);
      orderedDistances.push(item.distance);
    });
  });

  // Create y position mappings to ensure alignment
  const yPositionMap = {};
  let currentY = featureArray.length - 1; // Start from the top

  // Assign y positions based on corresponding target
  orderedQueries.forEach((query, index) => {
    const target = orderedTargets[index];
    if (!(query in yPositionMap)) {
      yPositionMap[query] = currentY;
    }
    if (!(target in yPositionMap)) {
      yPositionMap[target] = currentY;
    }
    // decrease Y coord for every round
    currentY--;
  });

  // Define layout
  const layout = {
    title: `<b>Homologs of genes from ${source_organism} to ${target_organism}`,
    showlegend: true, // global
    staticPlot: true,
    xaxis: {
      showgrid: false,
      zeroline: false,
      showticklabels: false,
      range: [-0.5, 1.5],
    },
    yaxis: {
      showgrid: false,
      zeroline: false,
      showticklabels: false,
    },
    height: orderedTargets.length * 45 + 300,
    width: 1000,
  };

  // START: Define and construct plotly data
  const plotData = [
    // Gene nodes (for both queried and target)
    {
      type: "scatter",
      mode: "markers+text",
      x: [],
      y: [],
      text: [],
      textfont: {
        weight: "bold",
      },
      textposition: [],
      marker: {
        size: 20,
        color: [],
      },
      showlegend: false, // local
      hoverinfo: "none",
    },
    // distance data
    {
      type: "scatter",
      mode: "text",
      x: [],
      y: [],
      text: [],
      textposition: "top center",
      showlegend: false,
      textfont: {
        size: 10,
        color: "black",
      },
      hoverinfo: "none",
    },
    // text to show the No. of hidden nodes
    {
      type: "scatter",
      mode: "text",
      x: [],
      y: [],
      text: [],
      textposition: "center",
      showlegend: false,
      textfont: {
        size: 12,
        color: "black",
      },
      hoverinfo: "none",
    },
  ];

  // Line width counter for each query
  const queryLineWidthCounter = {};
  // Add nodes and edges to the plotData
  orderedQueries.forEach((query, index) => {
    const target = orderedTargets[index];
    const distance = orderedDistances[index];
    const sourceY = yPositionMap[query];
    const targetY = yPositionMap[target];

    // Initialize or increment the line width counter for the current query
    if (!(query in queryLineWidthCounter)) {
      queryLineWidthCounter[query] = 0;
    }
    queryLineWidthCounter[query]++;

    // Compute line style based on distance
    const { width, dash } = getLineStyle(distance);

    // show distance between nodes
    const midX = 0.5;
    const midY = (sourceY + targetY) / 2;

    // when distance it valid, draw the line and dots
    if (distance > 0) {
      plotData.push({
        type: "scatter",
        mode: "lines",
        x: [0.025, 0.975, null],
        y: [sourceY, targetY, null],
        line: {
          width: width,
          dash: dash,
          color: "black",
        },
        showlegend: false,
      });
      plotData[1].x.push(midX);
      plotData[1].y.push(midY);
      plotData[1].text.push(distance.toFixed(2));

      // null is used here to ensure that the line will only connect queried gene and it's target
      plotData[0].x.push(0, 1);
      plotData[0].y.push(sourceY, targetY);
      plotData[0].text.push(query, target);
      plotData[0].marker.color.push("#f5222d", "#1677ff"); // Colors for queried genes and target genes
      plotData[0].textposition.push("middle left", "middle right");
    } else {
      // push the "...N more" node here
      plotData[2].x.push(1);
      plotData[2].y.push(targetY);
      plotData[2].text.push(target);
    }
  });

  // END: Define and construct plotly data

  // START: Defind and construct legend

  const sourceSpecies = {
    x: [null],
    y: [null],
    mode: "markers",
    marker: {
      color: "#f5222d",
      size: 10,
    },
    name: `Genes from ${source_organism}`,
    showlegend: true,
    hoverinfo: "none",
  };

  const targetSpecies = {
    x: [null],
    y: [null],
    mode: "markers",
    marker: {
      color: "#1677ff",
      size: 10,
    },
    name: `Genes from ${target_organism}`,
    showlegend: true,
    hoverinfo: "none",
  };

  // Legend of line styles
  const legendItems = [
    { range: "0-5", width: 5, dash: "solid" },
    { range: "5-10", width: 4, dash: "solid" },
    { range: "10-20", width: 3, dash: "solid" },
    { range: "20-30", width: 2, dash: "solid" },
    { range: "30-40", width: 1, dash: "solid" },
    { range: ">40", width: 1, dash: "dot" },
  ];

  // Add legends to plot:

  plotData.push(sourceSpecies);
  plotData.push(targetSpecies);

  legendItems.forEach((item) => {
    plotData.push({
      type: "scatter",
      mode: "lines",
      x: [null, null],
      y: [null, null],
      line: {
        width: item.width,
        dash: item.dash,
        color: "#434343",
      },
      name: `Distance ${item.range}`,
    });
  });

  let csvIcon = {
    'width': 857.1,
    'height': 1000,
        'path': 'm214-7h429v214h-429v-214z m500 0h72v500q0 8-6 21t-11 20l-157 156q-5 6-19 12t-22 5v-232q0-22-15-38t-38-16h-322q-22 0-37 16t-16 38v232h-72v-714h72v232q0 22 16 38t37 16h465q22 0 38-16t15-38v-232z m-214 518v178q0 8-5 13t-13 5h-107q-7 0-13-5t-5-13v-178q0-8 5-13t13-5h107q7 0 13 5t5 13z m357-18v-518q0-22-15-38t-38-16h-750q-23 0-38 16t-16 38v750q0 22 16 38t38 16h517q23 0 50-12t42-26l156-157q16-15 27-42t11-49z',
    'transform': 'matrix(1 0 0 -1 0 850)'
  };

  // Define CSV file structure based on plotType
  let plotName = `homologos_graph_${source_organism}_to_${target_organism}`;

  const generateCSV = (queries, targets, distances) => {
    // Define CSV headers
    let csvContent = `data:text/csv;charset=utf-8,Queried organism,${source_organism}\nTarget organism,${target_organism}\n\nQueried genes,Target genes,Distances\n`;
    for (let i = 0; i < queries.length; i++) {
      csvContent += `${queries[i]},${targets[i]},${distances[i]}\n`;
    }
    return csvContent;
  };

  // Code generated by chatGTP:
  const downloadCSV = (csvContent, fileName) => {
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  // config to remove unused tools
  let config = {
    modeBarButtonsToAdd: [
      [{
        name: 'Download data as CSV',
        icon:  csvIcon,
        click: function(gd) {
          const csvContent = generateCSV(queries, targets, distances);
          downloadCSV(csvContent, plotName + '.csv');
        }
      }]
    ],
    modeBarButtonsToRemove: [
      "zoom2d",
      "pan2d",
      "select2d",
      "lasso2d",
      "autoScale2d",
      "zoomIn2d",
      "zoomOut2d",
      "zoomInGeo",
    ],
  };

// Make genes on the plot clickable and give suggestion query:
// A function that handle gene name click event
const featureLabelClick = (event) => {
    const clickedFeature = event.target.textContent;
    const species = event.target.__data__.x === 0 ? source_organism : target_organism;
    let message = `what are the highest ${clickedFeature} expressors in ${species}?`;
    setLocalMessage(message);
};

  return (
    <div>
      <div style={{ margin: '0 2vw' }}>
        <Plot 
          data={plotData}
          layout={layout}
          config={config} 
          onAfterPlot={() => {
              // https://stackoverflow.com/questions/47397551/how-to-make-plotly-js-listen-the-click-events-of-the-tick-labels
              document.querySelectorAll('.plot-container .plot')[0].style.cursor = 'pointer';
              document.querySelectorAll('.plot-container .plot')[0].style['pointer-events'] = 'all';

              selectAll(".plot")
                .selectAll('text')
                .on("click", (event) => featureLabelClick (event));
            }}
            onInitialized={(figure, graphDiv)=>{
              document.querySelectorAll('.plot-container .plot')[0].style.cursor = 'pointer';
              document.querySelectorAll('.plot-container .plot')[0].style['pointer-events'] = 'all';

              selectAll(".plot")
                .selectAll('text')
                .on("click", (event) => featureLabelClick (event));
            }}
        />
      </div>
      <div style={{ display: 'flex', margin: '0 3vw' }}>
        <InfoCircleOutlined style={{ fontSize: '18px', color: '#1890ff', marginRight: '15px' }} />
        <Paragraph style={{ margin: 0, fontSize: '15px'}}>
          Homologs are computed as follows: the algorithm first generates ESM1b embeddings for each protein-coding gene sequence. These embeddings are then compressed using <Link href="https://doi.org/10.1073/pnas.2211823120" target="_blank">PROST</Link> (PRotein Ortholog Search Tool). It then calculates the L1 distances between the compressed embedding of the query gene and all genes in the target species. Finally, it reports the genes with the smallest L1 distances as potential homologs to the query gene.
        </Paragraph>
      </div>
    </div>
  );
};

export default HomologsGraph;
