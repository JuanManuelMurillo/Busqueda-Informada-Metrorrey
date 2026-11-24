import heapq
import math

from app.search.heuristic import heuristic

# Devuelve el camino de nodos (estación, línea) desde el origen hasta el goal_node.
def reconstruct_path(goal_node, parent):
    path = []
    node = goal_node

    # Continuar con los padres desde la meta hasta el origen
    while node is not None:
        path.append(node)
        node = parent[node]

    # De meta -> origen a origen -> meta
    path.reverse()
    return path

# Convierte el camino de nodos (estación, línea), en una lista de estaciones
# no repite las de transbordos
def path_to_stations(path):
    stations = []

    for station, _line in path:
        # Solo se añade la estación si es distinta de la última que se añadió
        if not stations or stations[-1] != station:
            stations.append(station)
    return stations

# Busca la ruta óptima entre dos estaciones con A*
def a_star(metro, origin, destination):

    # h(n) del nodo hasta el destino
    def h(node):
        return heuristic(node, destination, metro.coords)

    # Lista abierta (Nodos descubiertos pendientes de expandir)
    frontier = []

    # g[nodo] -> menor coste conocido desde el origen hasta dicho nodo (km)
    g = {}

    # parent[nodo] -> nodo anterior en el mejor camino conocido
    parent = {}

    # Lista cerrada (Nodos expandidos)
    closed = set()

    # Desempate
    # Si 2 entradas tienen la misma f, sale antes la que entró antes
    # Se incrementa después de cada heappush para que ningún número se repita
    tie = 0

    for node in metro.nodes_of(origin):
        g[node] = 0.0
        parent[node] = None
        # f = g + h = 0 + h(nodo)
        heapq.heappush(frontier, (h(node), tie, node))
        tie += 1

    # Mientras haya nodos por explorar
    while frontier:
        # Se saca el nodo con menor f = g + h
        _f, _tie, node = heapq.heappop(frontier)

        if node in closed:
            continue

        # Si se llegó a la estación destino, reconstruir el camino y mandarlo al front
        if node[0] == destination:
            path = reconstruct_path(node, parent)
            return {
                "stations": path_to_stations(path),
                "cost": g[node],
            }

        # Marcar el nodo como expandido
        closed.add(node)

        # Revisar cada vecino y el coste para llegar
        for neighbor, cost in metro.neighbors(node):
            if neighbor in closed:
                continue

            # Costo de llegar al vecino pasando por el nodo actual
            new_g = g[node] + cost

            # Si nunca se había alcanzado o este camino es mejor, se guarda
            if new_g < g.get(neighbor, math.inf):
                g[neighbor] = new_g
                parent[neighbor] = node
                heapq.heappush(frontier, (new_g + h(neighbor), tie, neighbor))
                tie += 1

    return None