import callAPI from "./callAPI.js";

// decide if an NLP response triggers a plot update
const updatePlotIntents = [
    "markers",
    "highest_measurement",
    "average",
    "fraction_detected",
    "add",
    "remove",
    "celltypexorgan",
  ];

export const triggersPlotUpdate = ((response) => {
    if (!response)
        return false;
    if (!response.hasData)
        return false;

    const generalIntent = response.intent.split(".")[0];
    console.log("general intent:");
    console.log(generalIntent);
    return updatePlotIntents.includes(generalIntent);
});


export const updateChat = async (response) => {
    let entities = response.entities;
    let intent = response.intent;
    let complete = response.complete;
    console.log(response);
    if (intent === "None") {
      return {
        hasData: false,
        message: "Sorry I didn't get that. Please rephrase.",
      };
    }
  
    console.log(complete);
    if (!complete) {
      // forward the followup question to chatbox
      return {
        hasData: false,
        message: response.followUpQuestion,
      };
    }
  
    console.log("current intent is" + intent);
    const { endpoint, params } = window.buildAPIParams(intent, entities);
    const apiData = await callAPI(endpoint, params);
    console.log(apiData);
    const answer = window.buildAnswer(intent, apiData);
    return {
      hasData: true,
      params: params,
      data: apiData,
      message: answer,
    };
  };