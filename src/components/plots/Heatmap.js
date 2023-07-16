import Plot from 'react-plotly.js';

const Heatmap = ({ xaxis, yaxis, values, organism, organ }) => { 
	const geneCardLink = (gene) =>
    `https://www.genecards.org/cgi-bin/carddisp.pl?gene=${gene}`;

	const yTickTexts = yaxis.map((gene) => {
		const link = geneCardLink(gene);
		return `<a href="${link}" target="_blank">${gene}</a>`;
	});
	const yTickVals = yaxis.map((_, index) => index);

	let data = [
		{
			z: values,
			x: xaxis,
			y: yaxis,
			type: 'heatmap',
			colorscale: 'Reds',
			hovertemplate:
			"%{yaxis.title.text}: %{y} <br>" +
			"%{xaxis.title.text}:%{x} <br>" +
			"Expression: %{z}" +
			"<extra></extra>"
		}
	];

	let longestXlabel = 0, longestYlabel = 0;
    for (let i=0; i < xaxis.length; i++) {
        longestXlabel = Math.max(longestXlabel, xaxis[i].length);
    }
	for (let i=0; i < yaxis.length; i++) {
		longestYlabel = Math.max(longestYlabel, yaxis[i].length);
	}

	let nfeatures = yaxis.reduce((acc, a) => acc + a.length, 0);
    let ncelltypes = xaxis.length;
    let pxCell = 15, pxChar = 6;
    let ytickMargin = 85 + pxChar * longestYlabel;
    let xtickMargin = pxChar * longestXlabel;
    let graphWidth = ytickMargin + pxCell * ncelltypes + 300;
    let graphHeight = pxCell * nfeatures * 0.6 + xtickMargin;

	let layout = {
		width: graphWidth,
        height: graphHeight,
		xaxis: {
			automargin: true,
			title: {
				text: 'Cell types',
				font: {
				size: 18,
				},
				standoff: 20,
			},
			y: 10,
		},
		yaxis: {
			automargin: true,
			title: {
				text: 'Genes',
				font: {
				  size: 18,
				},
				standoff: 20,
			},
			tickmode: 'array',
			ticktext: yTickTexts,
			tickvals: yTickVals,
		},
		title: `<b>Heatmap of gene expression in ${organism} ${organ}</b>`,
	};

return (
    <Plot
		data={data}
		layout={layout}
	/>
  );
}

export default Heatmap;