import { API_URL } from '../config';

async function request(path, options) {
  const response = await fetch(`${API_URL}${path}`, options);

  if (!response.ok) {
    throw new Error(`Error ${response.status} al llamar a ${path}`);
  }

  return response.json();
}

export function get(path) {
  return request(path);
}

export function post(path, body) {
  return request(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}
