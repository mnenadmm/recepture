from flask import Blueprint

nesa = Blueprint('example_blueprinta', __name__ )


@nesa.route('/z')
def index():
    return f"Bravo neso example_blueprint aaaaaaaaaaaaaaaaaaaaaaa"


