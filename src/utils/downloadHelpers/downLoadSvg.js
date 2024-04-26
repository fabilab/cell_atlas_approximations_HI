
export const downloadSVG = (plotName) => {
    const plot = document.querySelector('.js-plotly-plot');
    const svgData = new XMLSerializer().serializeToString(plot.querySelector('svg'));
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = plotName;
    link.click();

    URL.revokeObjectURL(url);
};
