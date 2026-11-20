import routeResponse from '../shared/data/route.json';
import { Route } from '../models/Route';

// Lectura de un JSON estático para pruebas
export async function calculateRoute() {
  return Route.fromJson(routeResponse);
}
