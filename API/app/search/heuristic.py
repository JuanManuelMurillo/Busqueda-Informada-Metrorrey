import math

# Radio de la Tierra
EARTH_RADIUS_KM = 6371.0

# Distancia (km) en línea recta entre dos puntos (lat, lon).
def haversine_km(a, b):
    lat1, lon1 = map(math.radians, a)
    lat2, lon2 = map(math.radians, b)
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    h = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    return 2 * EARTH_RADIUS_KM * math.asin(math.sqrt(h))

# Distanca (km) en línea recta desde una estación hasta la estación destino.
def heuristic(node, goal_station, coords):
    station = node[0]
    return haversine_km(coords[station], coords[goal_station])
