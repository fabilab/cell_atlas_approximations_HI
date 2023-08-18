async function callAPI(endpoint, params = {}) {

    // Phrase https request from params (they are all GET for now, so URI encoding suffices)
    let uri = "https://api.atlasapprox.org/v1/" + endpoint

    const uriSuffix = new URLSearchParams(params).toString();
    if (uriSuffix !== "")
        uri += "?" + uriSuffix;
    let response = await fetch(uri);

    // Check response
    let data;
    if (!response.ok) {
        data = {
            error: "API call failed",
        }
    } else {
        // NOTE: response.body is a stream, so it can be processed only ONCE
        data = await response.json();
    }
    return data;
}


export default callAPI;