import '../styles/RouteCost.css';

const formatKm = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Coste total de la ruta calculado por A*
export function RouteCost({ distanceKm }) {
  if (distanceKm == null) return null;

  return (
    <div className="route-cost">
      <span className="route-cost__label">Distancia total</span>
      <span className="route-cost__value">{formatKm.format(distanceKm)} km</span>
    </div>
  );
}

export default RouteCost;
