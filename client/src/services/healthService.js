import { get } from './apiClient';
import { HealthStatus } from '../models/HealthStatus';

export async function fetchHealth() {
  const data = await get('/health');
  return HealthStatus.fromJson(data);
}
