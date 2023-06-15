from flask import Flask
from flask_restx import Resource, Api
from flask_cors import CORS
import atlasapprox

from models import *


app = Flask(__name__)
CORS(app)
api = Api(app)
client = atlasapprox.API()


@api.route('/organisms')
class GetAllOrganisms(Resource):
    def get(self):
        
        return client.organisms()

organs_search_input = api.model('organs-search-input', organs_search_model)
avg_expression_search_input = api.model('avg-expression-search-input', avg_expression_search_model)

@api.route('/organs')
class GetOrgans(Resource):

    @api.expect(organs_search_input)
    def post(self):
        return client.organs(organism=api.payload['organism'])  


@api.route('/average')
class GetAverage(Resource):

    @api.expect(avg_expression_search_input)
    def post(self):
        df = client.average(
            organism=api.payload['organism'],
            organ=api.payload['organ'],
            features=api.payload['features']
        )

        average = [list(gene_expr.values()) for gene_expr in df.to_dict('records')]

        result = {
            'organism': api.payload['organism'],
            'organ': api.payload['organ'],
            'features': api.payload['features'],
            'average': average,
            'celltypes': list(df.columns),
            "unit": "counts per ten thousand"
        }

        return result



if __name__ == '__main__':
    app.run(debug=True)