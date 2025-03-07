import Plot from "react-plotly.js";

const HighestMeasurementScoreBar = ({ state }) => {
  const { organism, celltypesOrgan, score, hasLog } = state;
  let yValue = score.map((x) => Number(x.toPrecision(3)));
  
  let trace1 = {
    x: celltypesOrgan,
    y: score,
    type: "bar",
    text: yValue.map(String),
    textposition: "auto",
    hoverinfo: "none",
    marker: {
      color: "rgb(64, 145, 199)",
      opacity: 0.9,
      line: {
        color: "rgb(204,204,204)",
        width: 1,
      },
    },
  };
  let layout = {
    width: celltypesOrgan.length * 40 + 300,
    height: "100%",
    xaxis: {
      automargin: true,
      title: {
        text: "Cell types(Organs)",
        standoff: 20,
      },
      tickangle: 270,
    },
    yaxis: {
      title: {
        text: hasLog ? "Log10(score)" : "score",
        standoff: 20,
      },
    },
    title: `<b>Expression score of genes across ${organism} top cell types & organs$`
  };

  let data = [trace1];

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Plot data={data} layout={layout} />
    </div>
  );
};

export default HighestMeasurementScoreBar;
