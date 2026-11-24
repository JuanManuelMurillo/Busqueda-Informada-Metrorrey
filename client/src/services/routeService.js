import { post } from './apiClient';
import { Route } from '../models/Route';

// Pide al backend la ruta óptima (A*) entre dos estaciones
export async function calculateRoute(origin, destination) {
  const data = await post('/route', { origin, destination });
  return Route.fromJson(data);
}
