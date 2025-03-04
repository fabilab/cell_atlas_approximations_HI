function transpose(matrix) {
    return matrix[0].map((col, c) => matrix.map((row, r) => matrix[r][c]));
}
  
function transformData(data, hasLog = false) {
    const transformSingleValue = (value) => {
      if (hasLog) {
        return Math.log10(value + 1); // Base-10 log with offset
      }
      return value;
    };
  
    // Handle 2D arrays by mapping over each sub-array
    if (Array.isArray(data) && Array.isArray(data[0])) {
      return data.map(row => row.map(transformSingleValue));
    }
    // Handle 1D arrays
    if (Array.isArray(data)) {
      return data.map(transformSingleValue);
    }
    // Handle single values
    return transformSingleValue(data);
  }
  
  export { transpose, transformData };