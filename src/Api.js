// AtlasApprox API:
// https://atlasapprox.readthedocs.io/en/latest/rest/index.html#getting-started

export default class Api {
    constructor () {
        this.api_url = "http://localhost:5000/";
        // this.api_url = "https://api.atlasapprox.org/v1/";
    }

    getOrganisms = async () => this.makeRequest('/organisms', 'GET');

    getAvgExpression = async (organism, organ, genes) => this.makeRequest(
        'average',
        'POST',
        {
            organism: organism,
            organ: organ,
            features: genes
        }
    )

    makeRequest = async (path, method, body) => {
        return fetch(this.api_url + path, {
            method: method || 'GET',
            headers: {
                "Content-Type": "application/json"
            },
            ...(body ? { body: JSON.stringify(body) } : {})
        }).then((res) => {
            if (res.status === 401) {
                return false;
            } else {
                return res.json();
            }
        })
    }
}