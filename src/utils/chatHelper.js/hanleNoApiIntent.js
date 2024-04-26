// handleNoApiIntents.js

import { buildAnswer } from '../nlpResponseGenerator.js';
import { downloadFasta } from "../downloadHelpers/downloadFasta.js";
import { downloadTable } from "../downloadHelpers/downloadTable.js";

export function handleNoApiIntents(mainIntent, subIntent, intent, plotState, params) {
  let answer;

  switch (mainIntent) {
    case "download":
      let downloadAvailable = true;
      if (plotState.plotType === 'featureSequences') {
        try {
          downloadFasta(plotState)
        } catch (err) {
          downloadAvailable = false;
        }
      } else if (plotState.plotType === 'celltypeXorgan' || plotState.plotType === 'organXorganism') {
        try {
          downloadTable(plotState, plotState.plotType)
        } catch (err) {
          downloadAvailable = false;
        }
      }
      answer = buildAnswer(intent, plotState, { success: downloadAvailable });
      return {
        message: answer,
      };
    case "plot":
      answer = buildAnswer(intent, plotState);
      return {
        hasData: true,
        params: params,
        data: plotState.data,
        message: answer,
      };
    case "greetings":
      if (subIntent === "bye") {
        return {
          resetEverything: true,
          message: "",
        };
      }
      answer = buildAnswer(intent, plotState);
      return {
        message: answer,
      };
    default:
      answer = buildAnswer(intent, plotState);
      return {
        message: answer,
      };
  }
}