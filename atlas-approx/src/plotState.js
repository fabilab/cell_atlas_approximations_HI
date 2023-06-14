import { useState } from "react";
import Api from "../Api";

const plotContent = () => {

    // Initialise an object for the plot format
    const [plotFormat, setPlotFormat] = useState({
        intent: "average",
        plotType: "heatmap",
        organism: "",
        organ: "",
        features: "",
        transforms: [],
        data: {}
    });
  
    // Initialise an object for the plot data 
    const [plotData, setPlotData] = useState({
        // type: "matrix",
        // xaxis: ["T", "NK", ...],
        // yaxis: [gene1, gene2],
        // values: [[0, 1, 4, ...], [...]],
        // valueUnit: "counts per ten thousand",
        type: "",
        xaxis: [],
        yaxis: [],
        values: [],
        valueUnit: "counts per ten thousand",
    })
};

const handleSubmit = (text) => {

    const newPlotData = generatePlotData();
    setPlotFormat({
        organism: "",
        organ: "",
        features: "",
        transforms: [],
        data: {}
    });

    setPlotData({
        type: "",
        xaxis: [],
        yaxis: [],
        values: [],
    })
};

const generateNewData = (() => {
        async function fetchData () {
            if (!avgExpression) {
                const api = new Api();
                // const result = await api.getOrganisms();
                const result = await api.getAvgExpression('h_sapiens', 'Lung', geneList);
                setAvgExpression(result); // avgExpression = result
            }
        }

        fetchData();

}, [avgExpression, geneList]) // the useEffect function will only run when the avgExpression changes

  
export default plotContent;