import { useState } from 'react';
import { StationSelect } from '../shared/components/StationSelect';
import { PageTitle } from '../shared/components/PageTitle';
import { MetroMap } from '../shared/components/MetroMap';
import { Button } from '../shared/components/Button';
import { RouteStations } from '../shared/components/RouteStations';
import { RouteCost } from '../shared/components/RouteCost';
import { STATION_OPTIONS, STATIONS } from '../shared/data/stations';
import { LINES } from '../shared/data/lines';
import { useRouteViewModel } from '../viewmodels/useRouteViewModel';
import './styles/HomeView.css';


const LINE_LIST = Object.values(LINES);

export function HomeView() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const { routeStations, distanceKm, isLoading, error, calculate, reset } = useRouteViewModel();

  // Desechar la ruta al cambiar el origen o destino
  const handleOriginChange = (value) => {
    setOrigin(value);
    reset();
  };
  const handleDestinationChange = (value) => {
    setDestination(value);
    reset();
  };

  // Vaciar origen, destino y la ruta calculada
  const handleReset = () => {
    setOrigin('');
    setDestination('');
    reset();
  };

  const canCalculate = Boolean(origin && destination);
  const canReset = Boolean(origin || destination);

  // Evitar que se elija la misma estación en ambos input
  const originOptions = STATION_OPTIONS.map((station) => ({
    ...station,
    disabled: station.value === destination,
  }));
  const destinationOptions = STATION_OPTIONS.map((station) => ({
    ...station,
    disabled: station.value === origin,
  }));

  return (
    <main>

      <header className="home__header">
        <PageTitle>Buscador de rutas Metrorrey</PageTitle>
      </header>

      <div className="home__layout">
        <section className="home__stations">
          <StationSelect
            label="Estación de origen"
            placeholder="Selecciona una estación"
            options={originOptions}
            value={origin}
            onChange={handleOriginChange}
            required
          />
          <StationSelect
            label="Estación de destino"
            placeholder="Selecciona una estación"
            options={destinationOptions}
            value={destination}
            onChange={handleDestinationChange}
            required
          />

          <div className="home__actions">
            <Button
              className="home__calculate"
              onClick={() => calculate(origin, destination)}
              disabled={!canCalculate}
              isLoading={isLoading}
              loadingText="Calculando…"
            >
              Calcular ruta
            </Button>
            <Button
              variant="secondary"
              className="home__reset"
              onClick={handleReset}
              disabled={!canReset || isLoading}
              aria-label="Reiniciar búsqueda"
              title="Reiniciar búsqueda"
            >
              <svg className="home__reset-icon" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M4 10a6 6 0 1 0 1.76-4.24M4 3.5v3h3" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Button>
          </div>

          {error && (
            <p className="home__error" role="alert">
              No se pudo calcular la ruta. {error}
            </p>
          )}

          <RouteCost distanceKm={distanceKm} />
          <RouteStations stations={routeStations} />
        </section>

        <section className="home__chart">
          <MetroMap
            title="Mapa del Metrorrey"
            description="Estaciones de las líneas 1, 2 y 3 del Metrorrey con sus conexiones."
            stations={STATIONS}
            lines={LINE_LIST}
            route={routeStations}
          />
        </section>
      </div>

    </main>
  );
}
