import React from 'react';
import Plot from 'react-plotly.js';

// const prepareBubblePlotData = (celltypes, genes, fraction, average) => {
// 	let traces = [];
// 	for (let i = 0; i < genes.length; i++) {
// 		let trace = {
// 			x: celltypes,
// 			y: Array(celltypes.length).fill(genes[i]),
// 			mode: 'markers',
// 			marker: {
// 				symbol: 'circle',
// 				colorscale: 'Reds',
// 				colorbar: {},
// 				size: fraction[i].map((x) => x*20),
// 				color: average[i]
// 			}
// 		}
// 		traces.push(trace);
// 	}
// 	return traces
// }

const BubbleHeatmap = ({ xaxis, yaxis, average, fractions, organism, organ }) => {
    // console.log(xaxis, yaxis, fractions,average)
	const geneCardLink = (gene) =>
        `https://www.genecards.org/cgi-bin/carddisp.pl?gene=${gene}`;

    const yTickTexts = yaxis.map((gene) => {
        const link = geneCardLink(gene);
        return `<a href="${link}" target="_blank">${gene}</a>`;
    });
    const yTickVals = yaxis.map((_, index) => index);

	let dataList = [];
	for (let i = 0; i < yaxis.length; i++) {
		let data = {
			x: xaxis,
			y: Array(xaxis.length).fill(yaxis[i]),
			mode: 'markers',
			marker: {
				symbol: 'circle',
				colorscale: 'Reds',
				colorbar: {},
				size: fractions[i].map((x) => x*20),
				color: average[i]
			}
		}
		dataList.push(data);
	}

    const layout = {
		height: '1000px',
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
        title: `Bubble heatmap showing gene expression and fraction in ${organism} ${organ}`,
    };

    return <Plot 
			data={dataList} 
			layout={layout} 
		/>;
};

export default BubbleHeatmap;
