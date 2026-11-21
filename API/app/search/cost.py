from app.search.heuristic import haversine_km

# Coste de un tramo: longitud (km) de la vía entre dos estaciones consecutivas de una línea.
def segment_cost(segment, coords):
    straight = haversine_km(coords[segment["from"]], coords[segment["to"]])
    return max(segment["km"], straight)
