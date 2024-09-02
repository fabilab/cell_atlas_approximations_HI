/**
 * Loads an image from the provided path, calculates its intrinsic dimensions,
 * and adjusts scaling factors based on a specified rendered size.
 * @param {string} imagePath - The path to the image to be loaded.
 * @param {number} renderedSize - The size (in pixels) to which the image should be scaled.
 * @param {function} setScalingFactors - A state setter function to update the scaling factors.
 */
export const scaleImage = (imagePath, renderedSize, setScalingFactors) => {
    const img = new Image();
    img.src = imagePath;
    img.onload = () => {
        const intrinsicDimensions = {
            width: img.naturalWidth,
            height: img.naturalHeight,
        };
        setScalingFactors({
            width: renderedSize / intrinsicDimensions.width,
            height: renderedSize / intrinsicDimensions.height,
        });
    };
};
