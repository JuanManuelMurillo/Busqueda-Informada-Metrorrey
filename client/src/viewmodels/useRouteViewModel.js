import { useCallback, useMemo, useState } from 'react';
import { calculateRoute } from '../services/routeService';
import { STATIONS } from '../shared/data/stations';

const STATIONS_BY_ID = new Map(STATIONS.map((station) => [station.value, station]));

export function useRouteViewModel() {
  const [route, setRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculate = useCallback(async (origin, destination) => {
    setIsLoading(true);
    setError(null);
    try {
      setRoute(await calculateRoute(origin, destination));
    } catch (err) {
      setRoute(null);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setRoute(null);
    setError(null);
  }, []);

  const routeStations = useMemo(
    () => (route ? route.stationIds.map((id) => STATIONS_BY_ID.get(id)).filter(Boolean) : []),
    [route],
  );

  return {
    routeStations,
    isLoading,
    error,
    calculate,
    reset,
  };
}