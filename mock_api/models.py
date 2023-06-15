from flask_restx import fields

organs_search_model = {
    'organism': fields.String
}

avg_expression_search_model = {
    'organism': fields.String,
    'organ': fields.String,
    'features': fields.List(fields.String)
}


