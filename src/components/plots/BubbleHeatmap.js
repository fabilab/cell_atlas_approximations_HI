import React from 'react';
import Plot from 'react-plotly.js';

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
				color: average[i],
            },
            hovertemplate: 
                '%{yaxis.title.text}: %{y}<br>' +
                '%{xaxis.title.text}: %{x}<br>' +
                'Average: %{marker.color:.3f}<br>' +
                'Fraction: %{marker.size:.3f}<extra></extra>'
		}

		dataList.push(data);
	}

    let layout = {
        xaxis: {
            automargin: true,
            title: {
                text: 'Cell types',
                font: {
                    size: 17,
                },
                standoff: 20,
            },
            tickangle: 90,
        },
        yaxis: {
            automargin: true,
            title: {
                text: 'Genes',
                font: {
                    size: 17,
                },
                standoff: 20,
            },
            tickmode: 'array',
            ticktext: yTickTexts,
            tickvals: yTickVals,
        },
        title: `<b>Bubble heatmap showing gene expression and fraction in ${organism} ${organ}</b>`,
    };

    let config = {
        toImageButtonOptions: {
            format: 'svg', // one of png, svg, jpeg, webp
            filename: 'custom_image',
            height: 500,
            width: 700,
            scale: 1,
        },
        editable: true, 
        scrollZoom: true,
    }

    return <Plot 
			data={dataList} 
			layout={layout} 
            config={config}
		/>;
};

export default BubbleHeatmap;
