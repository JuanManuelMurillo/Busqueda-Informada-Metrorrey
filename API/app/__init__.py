from flask import Flask
from flask_cors import CORS

from config import Config


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    CORS(app)

    # El grafo del metro se construye una sola vez y lo reutilizan todas las peticiones
    from app.models.metro import MetroGraph
    app.config["METRO"] = MetroGraph.from_json()

    from app.routes import register_blueprints
    register_blueprints(app)

    return app
