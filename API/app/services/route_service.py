from app.search.a_star import a_star


# Calcula la ruta óptima entre dos estaciones y la devuelve en el formato que espera el front
def find_route(metro, origin, destination):
    result = a_star(metro, origin, destination)
    return {"stations": result["stations"], "distance_km": result["cost"]}
