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
    let all_x = [];
    let all_y = [];
    let all_color = [];
    let all_size = [];
    let all_hovertext = [];


	for (let i = 0; i < yaxis.length; i++) {
        all_x = all_x.concat(xaxis);
        all_y = all_y.concat(Array(xaxis.length).fill(yaxis[i]));
        all_color = all_color.concat(average[i]);
        all_size = all_size.concat(fractions[i].map((x) => x.toPrecision(3)*100));

        const text = xaxis.map((celltype, index) => {
            return (
                `Gene: ${yaxis[i]}<br>Cell Type: ${celltype}<br>Avg Exp: ${average[i][index].toPrecision(3)}<br>Proportion: ${fractions[i][index].toPrecision(3)*100}%`
            );
        })

        all_hovertext = all_hovertext.concat(text);
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

    const desired_maximum_marker_size = 6.2;
    
    let data = {
        x: all_x,
        y: all_y,
        mode: 'markers',
        marker: {
          color: all_color,
          size: all_size,
          sizeref: 2 * Math.max(...all_size) / (desired_maximum_marker_size**2),
          colorscale: 'YlGnBu',
          reversescale:true,
          colorbar: {},
        },
        text: all_hovertext,
        hoverinfo: 'text',
    };
      
    console.log(data);

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
			data={[data]} 
			layout={layout} 
            config={config}
		/>;
};

export default BubbleHeatmap;
