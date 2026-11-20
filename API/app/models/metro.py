import json
from itertools import permutations
from pathlib import Path

from app.search.cost import segment_cost as track_cost

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "metro.json"


# Carga de datos desde el JSON
def load_data(path=DATA_PATH):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


class MetroGraph:

    def __init__(self, data, segment_cost=track_cost):
        # Estaciones y coordenadas por id
        self.stations = {s["id"]: s for s in data["stations"]}
        self.coords = {s["id"]: (s["lat"], s["lon"]) for s in data["stations"]}

        # Creación de los nodos (estación, línea)
        self.graph = {}
        for s in data["stations"]:
            for line in s["lines"]:
                self.graph[(s["id"], line)] = []

        # Aristas entre estaciones consecutivas de cada línea (en ambos sentidos),
        # con la longitud por la vía de cada tramo
        for line in data["lines"]:
            for segment in line["segments"]:
                a, b = segment["from"], segment["to"]
                cost = segment_cost(segment, self.coords)
                self.graph[(a, line["id"])].append(((b, line["id"]), cost))
                self.graph[(b, line["id"])].append(((a, line["id"]), cost))

        # Aristas de transbordo entre líneas de la misma estación.
        # Coste 0: cambiar de línea no penaliza, solo conecta los andenes
        for t in data["transfers"]:
            # Pares ordenados de líneas: (L1, L2) y (L2, L1), un sentido cada uno
            for from_line, to_line in permutations(t["lines"], 2):
                # Andén de origen -> andén de la otra línea, en la misma estación
                self.graph[(t["station"], from_line)].append(((t["station"], to_line), 0))

    @classmethod
    def from_json(cls, path=DATA_PATH, **costs):
        return cls(load_data(path), **costs)

    def has_station(self, station_id):
        return station_id in self.stations

    def neighbors(self, node):
        return self.graph[node]

    def nodes_of(self, station_id):
        # Nodos de una estación
        # Uno por cada línea (2 en los transbordos)
        return [(station_id, line) for line in self.stations[station_id]["lines"]]
