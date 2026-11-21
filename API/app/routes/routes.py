from flask import Blueprint, current_app, jsonify, request

from app.services.route_service import find_route

route_bp = Blueprint("route", __name__)


@route_bp.post("/route")
def calculate_route():
    data = request.get_json(silent=True) or {}

    origin = data.get("origin")
    destination = data.get("destination")

    if not isinstance(origin, str) or not isinstance(destination, str) or not origin or not destination:
        return jsonify(error="Faltan los parámetros 'origin' y/o 'destination'"), 400

    # Se construye el grafo del metro al arrancar la aplicación
    metro = current_app.config["METRO"]

    route = find_route(metro, origin, destination)

    return jsonify(route), 200
