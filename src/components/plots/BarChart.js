import Plot from 'react-plotly.js';

const BarChart = ({ celltypesOrgan, average, organism, features }) => { 

	let xValue = celltypesOrgan
	let yValue = average.map(x => Number(x.toFixed(3)));
	
	let trace1 = {
		x: xValue,
		y: yValue,
		type: 'bar',
		text: yValue.map(String),
		textposition: 'auto',
		hoverinfo: 'none',
		marker: {
			color: 'rgb(158,202,225)',
			opacity: 0.9,
			line: {
			color: 'rgb(8,48,107)',
			width: 1
			}
		}
	};
	
	let data = [trace1];
	
	let layout = {
		xaxis: {
			automargin: true,
			title: {
				text: 'Cell types / Organs',
				font: {
				size: 18,
				},
				standoff: 40,
			},
		},
		yaxis: {
			title: {
				text: 'Measurements',
				font: {
				  size: 18,
				}
			}
		},

		title: `<b>Highest expressor of <a href="https://www.genecards.org/cgi-bin/carddisp.pl?gene=${features}" target="_blank">${features}</a> gene in ${organism}</b>`,
		barmode: 'stack',
	};
	
  return (
    <Plot
		data={data}
		layout={layout}
	/>
  );
};

export default BarChart;