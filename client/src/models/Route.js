export class Route {
  constructor(stationIds) {
    this.stationIds = stationIds;
  }

  static fromJson(json) {
    if (!Array.isArray(json?.stations)) {
      throw new Error('No se recibió la lista de estaciones');
    }
    return new Route(json.stations);
  }
}
