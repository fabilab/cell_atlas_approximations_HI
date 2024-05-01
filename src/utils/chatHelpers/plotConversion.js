
// Helper function to convert text to camelCase
const toCamel = (str) => {
    return str.replace(/(?!^)_(.)/g, (_, char) => char.toUpperCase());
};

// Function to handle conversion between heatmap and dotplot
export const handlePlotConversion = (mainIntent, subIntent, plotState, params) => {
  if (mainIntent === "convert_to") {
    const { plotType, features, organ, organism, celltype, measurement_type } = plotState;

    const plotTypeIntentMap = {
      dotplot: {
        average: {
          intent: `fraction_detected.${toCamel(measurement_type)}`,
          params: { features, organ, organism },
        },
        averageAcrossOrgans: {
          intent: `fraction_detected.${toCamel(measurement_type)}.across_organs`,
          params: { celltype, features, organism },
        },
      },
      heatmap: {
        fractionDetected: {
          intent: `average.${toCamel(measurement_type)}`,
          params: { features, organ, organism },
        },
        fractionDetectedAcrossOrgans: {
          intent: `average.${toCamel(measurement_type)}.across_organs`,
          params: { celltype, features, organism },
        },
      },
    };

    const conversion = plotTypeIntentMap[subIntent]?.[plotType];
    if (!conversion) {
      return { message: "Plot conversion is not available for the current plot type" };
    }
      
    const intent = conversion.intent;
    Object.assign(params, conversion.params);
    return {
      intent,
      mainIntent: intent.split(".")[0],
      subIntent: intent.split(".")[1] || null,
      params,
    };
  }
};