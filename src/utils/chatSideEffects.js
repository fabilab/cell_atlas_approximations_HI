import callAPI from "./callAPI.js";

// decide if an NLP response triggers a plot update
const updatePlotIntents = [
    "markers",
    "highest_measurement",
    "average",
    "fraction_detected",
    "add",
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



export const updateChat = ((response) => {
    let entities = response.entities; 
    let intent = response.intent;
    console.log(response)
    if(intent === "None")
        return {
            hasData: false,
            message: "Sorry I didn't get that. Please rephrase.",
        };

    let complete = response.complete;
    if (!complete) {
        // forward the followup question to chatbox
        console.log("follow up question is " + response.followUpQuestion);
        return {
            hasData: false,
            message: response.followUpQuestion,
        };
    }

    console.log("current intent is" + intent);
    const { endpoint, params } = window.buildAPIParams(intent,entities);
    callAPI(endpoint, params).then((data) => {
        console.log(data);
        const answer = window.buildAnswer(intent, data);
        return {
            hasData: true,
            params: params,
            data: data,
            message: answer,
        }
    });
})
