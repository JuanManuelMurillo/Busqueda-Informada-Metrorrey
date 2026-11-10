import { API_URL } from '../config';

export async function get(path) {
  const response = await fetch(`${API_URL}${path}`);

  if (!response.ok) {
    throw new Error(`Error ${response.status} al llamar a ${path}`);
  }

  return response.json();
}
