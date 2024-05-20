import React from "react";
import Plot from "react-plotly.js";

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
        target: `... ${totalTargetCounts - 5} more`,
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
    const queryLower = query.toLowerCase();
    const targetLower = orderedTargets[index].toLowerCase();
    if (!(queryLower in yPositionMap)) {
      yPositionMap[queryLower] = currentY;
    }
    if (!(targetLower in yPositionMap)) {
      yPositionMap[targetLower] = currentY;
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
    const sourceY = yPositionMap[query.toLowerCase()];
    const targetY = yPositionMap[target.toLowerCase()];

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

  // config to remove unused tools
  let config = {
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

  return (
    <div>
      <Plot data={plotData} layout={layout} config={config} />
    </div>
  );
};

export default HomologsGraph;
