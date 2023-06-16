import CanvasXpressReact from 'canvasxpress-react';

// props: arguments passed into React components
const Heatmap = (props) => {
    const target = props.target;
    const expression = props.values;
    const x_label = props.xaxis;
    const y_label = props.yaxis;

    console.log("making heatmap");

    let data =  {
        "y" : {
          "vars" : x_label,
          "smps" : y_label,
          "data" : expression,
        }
      };

    let nx = data.y.data[0].length;
    let width = 50 + 30 * nx;
    let ny = data.y.data.length;
    let height = 50 + 30 * ny;

    let config = {
        "graphOrientation": "vertical",
        "graphType": "Heatmap",
        "theme": "CanvasXpress",
        "title": "Heatmap of gene expression in " + props.organism,
    };

    return (
        //<div><img src="https://fabilab.org/images/logo2.png"></img></div>
        <CanvasXpressReact
            target={target}
            data={data}
            config={config}
            width={width}
            height={height}
        />
   )
    

}

export default Heatmap
