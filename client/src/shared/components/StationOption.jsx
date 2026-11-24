import '../styles/StationOption.css';

export const stationColor = (station) => station.lines?.[0]?.color ?? 'var(--color-border)';


export function StationOption({ station }) {
  return (
    <span
      className="station-option"
      style={{
        '--station-color': stationColor(station),
        '--transfer-color': station.lines?.[1]?.color ?? 'var(--color-surface)',
      }}
    >
      <span className="station-option__marker" aria-hidden="true" />

      <span className="station-option__text">
        <span className="station-option__name">{station.label}</span>
        <span className="station-option__lines">
          {station.lines.map((line) => (
            <span key={line.id} className="station-option__line">
              <span
                className="station-option__dot"
                style={{ backgroundColor: line.color }}
                aria-hidden="true"
              />
              {line.name}
            </span>
          ))}
        </span>
      </span>
    </span>
  );
}

export default StationOption;
