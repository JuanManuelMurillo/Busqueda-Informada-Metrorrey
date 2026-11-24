// Línea en la que se viaja en cada tramo entre estaciones de una ruta.
export const getSegmentLines = (stations) => {
  // Líneas elegidas por estaciones
  const segments = [];
  for (let i = 0; i < stations.length - 1; i += 1) {
    // IDs de las líneas de la estación siguiente
    const nextIds = new Set(stations[i + 1].lines.map((line) => line.id));
    // Guarda la línea de la estación actual que equivale a la línea de la siguiente
    const shared = stations[i].lines.filter((line) => nextIds.has(line.id));
    // Línea de la estación anterior
    const previous = segments[i - 1];
    segments.push(
      /**
       * Opciones:
       * - Seguir en la misma línea que la estación anterior
       * - Cambiar a la primera línea que comparten las estaciones
       */
      shared.find((line) => line.id === previous?.id) ?? shared[0],
    );
  }
  return segments;
};


/**
 * Regresa los datos de cada parada de la ruta:
 * - Línea de llegada
 * - Línea de salida
 * - Si hay o no transbordo
 */
export const getRouteStops = (stations) => {
  // Calcular la línea de cada tramo
  const segments = getSegmentLines(stations);
  return stations.map((station, index) => {
    // Estación de llegada
    const arriving = segments[index - 1] ?? null;
    // Estación de salida
    const leaving = segments[index] ?? null;
    return {
      station,
      index,
      arriving,
      leaving,
      isTransfer: Boolean(arriving && leaving && arriving.id !== leaving.id),
      isOrigin: index === 0,
      isDestination: index === stations.length - 1,
    };
  });
};
