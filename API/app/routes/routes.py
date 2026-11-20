from flask import Blueprint, jsonify, request

route_bp = Blueprint("route", __name__)

@route_bp.post("/route")
def calculate_route():
    data = request.get_json(silent=True) or {}

    origin = data.get("origin")
    destination = data.get("destination")

    if not origin or not destination:
        return jsonify(error="Falta el parámetro 'destino' y/o 'origne'"), 400

    stations = [origin, destination]

    return jsonify(stations=stations), 200