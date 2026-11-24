import { useMemo } from 'react';
import { defineChart, dot, lineY, text } from '@tanstack/charts';
import { scaleLinear } from '@tanstack/charts/scales/linear';
import { Chart } from '@tanstack/charts/react';
import { getRouteStops } from '../utils/route';
import '../styles/MetroMap.css';

// Margen alrededor de las estaciones
const PADDING = { top: 40, right: 60, bottom: 180, left: 40 };

// Tamaño de los círculos de estación
const STATION_RADIUS = 8;
const TRANSFER_INNER_RADIUS = 4;
const ENDPOINT_RADIUS = 11;

// Opacar las estaciones que no forman parte de la ruta (Cuando hay una ruta activa)
const DIMMED_OPACITY = 0.2;

// Posición del nombre respecto al punto de la estación
const LABEL_PLACEMENTS = {
  right: { anchor: 'start', dx: 16, dy: 4, rotate: 0 },
  topRight: { anchor: 'start', dx: 12, dy: -14, rotate: 0 },
  left: { anchor: 'end', dx: -16, dy: 4, rotate: 0 },
  below: { anchor: 'end', dx: 4, dy: 16, rotate: -90 },
};
const placement = (station) => LABEL_PLACEMENTS[station.labelAt] ?? LABEL_PLACEMENTS.right;

const EMPTY_ROUTE = [];

const labelOptions = {
  x: 'x',
  y: 'y',
  text: 'label',
  anchor: (station) => placement(station).anchor,
  dx: (station) => placement(station).dx,
  dy: (station) => placement(station).dy,
  rotate: (station) => placement(station).rotate,
  fontSize: 11,
};

/**
 * Marcas de la ruta:
 * - Trazo por cada tramo continuo en la misma línea
 * - Círculo por cada estación
 *    - aro: Línea de llegada
 *    - centro: línea de salida (En transbordos)
 *    (Estaciones de origen y destino más grandes)
 */
const buildRouteMarks = (route, lines) => {
  const stops = getRouteStops(route);

  // Secuencia de estaciones a recorrer en la misma línea
  const runs = [];
  stops.slice(0, -1).forEach((stop, i) => {
    const line = stop.leaving;
    const next = stops[i + 1].station;
    const current = runs[runs.length - 1];
    if (current && current.line.id === line.id) {
      current.rows.push(next);
    } else {
      runs.push({ line, rows: [stop.station, next] });
    }
  });
  // Aplanar runs y añadir a cada estación run y lineColor
  const trackRows = runs.flatMap((run, runIndex) =>
    run.rows.map((station) => ({ ...station, run: runIndex, lineColor: run.line.color })),
  );

  const markers = stops.map((stop) => ({
    ...stop.station,
    // Línea que da color al aro
    ringLine: (stop.arriving ?? stop.leaving)?.id,
    // Línea que da color al centro (Cuando hay conexión)
    centerLine: stop.isTransfer ? stop.leaving.id : null,
    // Si la estación es origen o destino
    isEndpoint: stop.isOrigin || stop.isDestination,
  }));

  return [
    lineY(trackRows, {
      id: 'route-tracks',
      x: 'x',
      y: 'y',
      // Agrupar los puntos por run para dibujar líneas separadas por grupo.
      z: 'run',
      stroke: (row) => row.lineColor,
      strokeWidth: 9,
    }),
    ...lines.flatMap((line) => [
      // Estaciones normales
      dot(markers.filter((m) => m.ringLine === line.id && !m.isEndpoint), {
        id: `route-stations-${line.id}`,
        x: 'x',
        y: 'y',
        r: STATION_RADIUS,
        fill: 'var(--color-surface)',
        stroke: line.color,
        strokeWidth: 3,
      }),
      // Estaciones origen / destino
      dot(markers.filter((m) => m.ringLine === line.id && m.isEndpoint), {
        id: `route-endpoints-${line.id}`,
        x: 'x',
        y: 'y',
        r: ENDPOINT_RADIUS,
        fill: 'var(--color-surface)',
        stroke: line.color,
        strokeWidth: 5,
      }),
    ]),
    // Estaciones de transbordo
    ...lines.map((line) =>
      dot(markers.filter((m) => m.centerLine === line.id), {
        id: `route-transfers-${line.id}`,
        x: 'x',
        y: 'y',
        r: TRANSFER_INNER_RADIUS,
        fill: line.color,
      }),
    ),
  ];
};

/**
 * Mapa de Metrorrey con Tanstack Charts.
 * 
 * Las estaciones de transbordo tienen el aro del color de su primera línea y el centro de la segunda.
 * Cuando se tiene una ruta seleccionada, el resto de estaciones se atenúa y la ruta se dibuja encima con el color de cada tramo.
 */
export function MetroMap({ title, description, stations, lines, route = EMPTY_ROUTE }) {
  const { definition, aspectRatio } = useMemo(() => {
    const hasRoute = route.length > 1;
    const baseOpacity = hasRoute ? DIMMED_OPACITY : 1;

    const byId = new Map(stations.map((station) => [station.value, station]));

    // Conversión de IDs de estaciones en datos completos de estaciones para cada línea
    const tracks = lines.flatMap((line) =>
      line.stations
        .map((id) => byId.get(id))
        .map((station) => ({ ...station, lineId: line.id, lineColor: line.color })),
    );

    const ringMarks = lines.map((line) =>
      dot(
        stations.filter((station) => station.lines[0]?.id === line.id),
        {
          id: `stations-${line.id}`,
          x: 'x',
          y: 'y',
          r: STATION_RADIUS,
          fill: 'var(--color-surface)',
          stroke: line.color,
          strokeWidth: 3,
          strokeOpacity: baseOpacity,
        },
      ),
    );
    const centerMarks = lines.map((line) =>
      dot(
        stations.filter((station) => station.lines[1]?.id === line.id),
        {
          id: `transfers-${line.id}`,
          x: 'x',
          y: 'y',
          r: TRANSFER_INNER_RADIUS,
          fill: line.color,
          fillOpacity: baseOpacity,
        },
      ),
    );

    const routeIds = new Set(route.map((station) => station.value));

    const xs = stations.map((station) => station.x);
    const ys = stations.map((station) => station.y);
    // Límites de gráfico
    const minX = Math.min(...xs) - PADDING.left;
    const maxX = Math.max(...xs) + PADDING.right;
    const minY = Math.min(...ys) - PADDING.top;
    const maxY = Math.max(...ys) + PADDING.bottom;

    return {
      aspectRatio: (maxX - minX) / (maxY - minY),
      definition: defineChart({
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        marks: [
          lineY(tracks, {
            x: 'x',
            y: 'y',
            z: 'lineId',
            stroke: (row) => row.lineColor,
            strokeWidth: 6,
            strokeOpacity: baseOpacity,
          }),
          ...ringMarks,
          ...centerMarks,
          ...(hasRoute ? buildRouteMarks(route, lines) : []),
          text(hasRoute ? stations.filter((s) => !routeIds.has(s.value)) : stations, {
            ...labelOptions,
            id: 'labels',
            fontWeight: 600,
            fill: hasRoute ? 'var(--color-sand-500)' : 'var(--color-heading)',
          }),
          ...(hasRoute
            ? [
                text(route, {
                  ...labelOptions,
                  id: 'route-labels',
                  fontWeight: 700,
                  fill: 'var(--color-heading)',
                }),
              ]
            : []),
        ],
        scales: {
          x: { scale: scaleLinear().domain([minX, maxX]), axis: false },
          y: { scale: scaleLinear().domain([maxY, minY]), axis: false },
        },
        focus: false,
      }),
    };
  }, [stations, lines, route]);

  return (
    <div className="metro-map">
      <Chart
        definition={definition}
        aspectRatio={aspectRatio}
        initialWidth={720}
        ariaLabel={title}
        ariaDescription={description}
      />
    </div>
  );
}

export default MetroMap;
