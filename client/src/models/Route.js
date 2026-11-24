export class Route {
  constructor(stationIds, distanceKm = null) {
    this.stationIds = stationIds;
    this.distanceKm = distanceKm;
  }

  static fromJson(json) {
    if (!Array.isArray(json?.stations)) {
      throw new Error('No se recibió la lista de estaciones');
    }
    return new Route(json.stations, json.distance_km ?? null);
  }
}
