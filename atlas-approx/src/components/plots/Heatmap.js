import CanvasXpressReact from 'canvasxpress-react';

// Source code: https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript
function transpose(matrix) {
    return matrix[0].map((col, c) => matrix.map((row, r) => matrix[r][c]));
}

// props: arguments passed into React components
const Heatmap = (props) => {
    const target = props.target;
    const expression = props.values;
    const x_label = props.xaxis;
    const y_label = props.yaxis;

    var data =  {
        "y" : {
          "vars" : x_label,
          "smps" : y_label,
          "data" : expression,
        }
      };

    var config = {
        "graphOrientation": "vertical",
        "graphType": "Heatmap",
        "theme": "CanvasXpress",
        "title": "Heatmap of gene expression in " + props.organism,
    };

    return (
        <CanvasXpressReact target={target} data={data} config={config} width={500} height={500} />
   )
    

}

export default Heatmap