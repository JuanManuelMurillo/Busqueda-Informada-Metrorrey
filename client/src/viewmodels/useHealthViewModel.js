import { useCallback, useEffect, useState } from 'react';
import { fetchHealth } from '../services/healthService';

export function useHealthViewModel() {
  const [health, setHealth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkHealth = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setHealth(await fetchHealth());
    } catch (err) {
      setHealth(null);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  let statusText = '';
  if (!isLoading) {
    statusText = health?.isHealthy ? 'API conectada' : 'API no disponible';
  }

  return {
    statusText,
    error,
  };
}
