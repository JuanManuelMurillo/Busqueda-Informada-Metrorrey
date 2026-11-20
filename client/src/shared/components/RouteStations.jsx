import { getSegmentLines } from '../utils/route';
import '../styles/RouteStations.css';

const plural = (count, singular, pluralForm) => `${count} ${count === 1 ? singular : pluralForm}`;


export function RouteStations({ stations }) {
  if (stations.length === 0) return null;

  const segments = getSegmentLines(stations);
  // Número de transbordos
  const transfers = segments.filter((line, i) => i > 0 && line.id !== segments[i - 1].id).length;
  // Posición de la última estación
  const lastIndex = stations.length - 1;

  return (
    <section className="route-stations" aria-labelledby="route-stations-title">
      <header className="route-stations__header">
        <h2 id="route-stations-title" className="route-stations__title">Ruta</h2>
        <p className="route-stations__summary">
          {plural(stations.length, 'estación', 'estaciones')}
          {' · '}
          {plural(transfers, 'transbordo', 'transbordos')}
        </p>
      </header>

      <ol className="route-stations__list">
        {stations.map((station, index) => {
          const arriving = segments[index - 1];
          const leaving = segments[index];
          const isTransfer = Boolean(arriving && leaving && arriving.id !== leaving.id);
          // Color del cícrulo de la estación)
          const markerColor = (arriving ?? leaving)?.color;

          // Añadir marcadores a las estaciones de origen y destino
          let role = null;
          if (index === 0) role = 'Origen';
          else if (index === lastIndex) role = 'Destino';

          return (
            <li
              key={`${station.value}-${index}`}
              className={[
                'route-stations__stop',
                (index === 0 || index === lastIndex) && 'route-stations__stop--end',
              ]
                .filter(Boolean)
                .join(' ')}
              style={{
                '--marker-color': markerColor,
                '--transfer-color': isTransfer ? leaving.color : 'var(--color-surface)',
                '--segment-color': leaving?.color ?? 'transparent',
              }}
            >
              <span className="route-stations__marker" aria-hidden="true" />
              <div className="route-stations__info">
                <span className="route-stations__name">
                  {station.label}
                  {role && <span className="route-stations__tag">{role}</span>}
                </span>
                {index === 0 && leaving && (
                  <span className="route-stations__note">{leaving.name}</span>
                )}
                {isTransfer && (
                  <span className="route-stations__note route-stations__note--transfer">
                    Transbordo: {arriving.name} → {leaving.name}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default RouteStations;
