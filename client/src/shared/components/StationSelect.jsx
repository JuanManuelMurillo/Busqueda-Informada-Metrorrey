import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { StationOption, stationColor } from './StationOption';
import '../styles/StationSelect.css';

// Líneas presentes en las opciones, sin repetir y ordenadas por id
const getLines = (options) => {
  const byId = new Map();
  options.forEach((option) => option.lines?.forEach((line) => byId.set(line.id, line)));
  return [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
};

// Texto en minúsculas y sin acentos, para buscar "nino" y encontrar "Niños Héroes"
const normalize = (text) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

// Estaciones de al menos una línea activa cuyo nombre contiene la búsqueda
const filterOptions = (options, activeLines, query) => {
  const search = normalize(query);
  return options.filter(
    (option) =>
      option.lines?.some((line) => activeLines.has(line.id)) &&
      normalize(option.label).includes(search),
  );
};

export function StationSelect({
  label,
  options,
  value,
  onChange,
  placeholder = 'Selecciona una estación',
  required = false,
  disabled = false,
  id,
}) {
  const generatedId = useId();
  const baseId = id ?? generatedId;
  const labelId = `${baseId}-label`;
  const buttonId = `${baseId}-button`;
  const listId = `${baseId}-list`;
  const optionId = (index) => `${baseId}-option-${index}`;

  const lines = useMemo(() => getLines(options), [options]);

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  // Por defecto todas las líneas están seleccionadas
  const [activeLines, setActiveLines] = useState(() => new Set(lines.map((line) => line.id)));
  const [query, setQuery] = useState('');
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const searchRef = useRef(null);
  const listRef = useRef(null);

  const selected = options.find((option) => option.value === value);
  const visibleOptions = filterOptions(options, activeLines, query);

  const findEnabled = (list, start, step) => {
    for (let i = start; i >= 0 && i < list.length; i += step) {
      if (!list[i].disabled) return i;
    }
    return -1;
  };

  // Opción activa inicial: la seleccionada si está visible, si no la primera habilitada
  const initialIndex = (list) => {
    const selectedIndex = list.findIndex((o) => o.value === value && !o.disabled);
    return selectedIndex >= 0 ? selectedIndex : findEnabled(list, 0, 1);
  };

  // Al abrir, la búsqueda empieza vacía
  const open = () => {
    setQuery('');
    setActiveIndex(initialIndex(filterOptions(options, activeLines, '')));
    setIsOpen(true);
  };

  const handleQueryChange = (event) => {
    const nextQuery = event.target.value;
    setQuery(nextQuery);
    setActiveIndex(initialIndex(filterOptions(options, activeLines, nextQuery)));
  };

  const close = (returnFocus = true) => {
    setIsOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  };

  const selectIndex = (index) => {
    const option = visibleOptions[index];
    if (!option || option.disabled) return;
    onChange(option.value);
    close();
  };

  const toggleLine = (lineId) => {
    const next = new Set(activeLines);
    if (next.has(lineId)) next.delete(lineId);
    else next.add(lineId);
    setActiveLines(next);
    setActiveIndex(initialIndex(filterOptions(options, next, query)));
  };

  // Al abrir, el foco va al buscador
  useEffect(() => {
    if (isOpen) searchRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || activeIndex < 0) return;
    listRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [isOpen, activeIndex]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isOpen]);

  // Cerrar cuando el foco sale del componente (Tab fuera de la lista o de los filtros)
  const handleBlur = (event) => {
    if (isOpen && !rootRef.current?.contains(event.relatedTarget)) setIsOpen(false);
  };

  const handleButtonKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      open();
    }
  };

  const handlePopupKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    }
  };

  // Navegación de la lista; desde el buscador, Inicio/Fin y Espacio siguen editando el texto
  const navigate = (event, { fromSearch = false } = {}) => {
    let next = -1;
    switch (event.key) {
      case 'ArrowDown':
        next = findEnabled(visibleOptions, activeIndex + 1, 1);
        break;
      case 'ArrowUp':
        next = findEnabled(visibleOptions, activeIndex - 1, -1);
        break;
      case 'Home':
        if (fromSearch) return;
        next = findEnabled(visibleOptions, 0, 1);
        break;
      case 'End':
        if (fromSearch) return;
        next = findEnabled(visibleOptions, visibleOptions.length - 1, -1);
        break;
      case ' ':
        if (fromSearch) return;
        event.preventDefault();
        selectIndex(activeIndex);
        return;
      case 'Enter':
        event.preventDefault();
        selectIndex(activeIndex);
        return;
      default:
        return;
    }
    event.preventDefault();
    if (next >= 0) setActiveIndex(next);
  };

  const emptyMessage =
    activeLines.size === 0 ? 'Selecciona al menos una línea' : 'No hay estaciones con ese nombre';

  return (
    <div className="station-select" ref={rootRef} onBlur={handleBlur}>
      {label && (
        <span id={labelId} className="station-select__label">
          {label}
          {required && <span className="station-select__required" aria-hidden="true"> *</span>}
        </span>
      )}

      <button
        ref={buttonRef}
        id={buttonId}
        type="button"
        className="station-select__trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listId : undefined}
        aria-labelledby={label ? `${labelId} ${buttonId}` : undefined}
        disabled={disabled}
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={handleButtonKeyDown}
      >
        {selected ? (
          <StationOption station={selected} />
        ) : (
          <span className="station-select__placeholder">{placeholder}</span>
        )}
        <svg className="station-select__chevron" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M5 7.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <div className="station-select__popup" onKeyDown={handlePopupKeyDown}>
          <div className="station-select__search">
            <svg className="station-select__search-icon" viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M13 13l4 4" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" />
            </svg>
            <input
              ref={searchRef}
              type="search"
              className="station-select__search-input"
              placeholder="Buscar estación"
              aria-label="Buscar estación por nombre"
              role="combobox"
              aria-expanded="true"
              aria-autocomplete="list"
              aria-controls={listId}
              aria-activedescendant={activeIndex >= 0 ? optionId(activeIndex) : undefined}
              autoComplete="off"
              value={query}
              onChange={handleQueryChange}
              onKeyDown={(event) => navigate(event, { fromSearch: true })}
            />
          </div>

          {lines.length > 1 && (
            <div className="station-select__filters" role="group" aria-label="Filtrar por línea">
              {lines.map((line) => {
                const isActive = activeLines.has(line.id);
                return (
                  <button
                    key={line.id}
                    type="button"
                    className="station-select__filter"
                    aria-pressed={isActive}
                    style={{ '--line-color': line.color }}
                    onClick={() => toggleLine(line.id)}
                  >
                    <span className="station-select__filter-dot" aria-hidden="true" />
                    {line.name}
                  </button>
                );
              })}
            </div>
          )}

          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            tabIndex={-1}
            className="station-select__list"
            aria-labelledby={label ? labelId : undefined}
            aria-activedescendant={activeIndex >= 0 ? optionId(activeIndex) : undefined}
            onKeyDown={navigate}
          >
            {visibleOptions.length === 0 && (
              <li className="station-select__empty" role="presentation">
                {emptyMessage}
              </li>
            )}
            {visibleOptions.map((option, index) => {
              const isSelected = option.value === value;
              const className = [
                'station-select__option',
                index === activeIndex && 'station-select__option--active',
                isSelected && 'station-select__option--selected',
                option.disabled && 'station-select__option--disabled',
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <li
                  key={option.value}
                  id={optionId(index)}
                  data-index={index}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled || undefined}
                  className={className}
                  style={{ '--station-color': stationColor(option) }}
                  onMouseEnter={() => !option.disabled && setActiveIndex(index)}
                  onClick={() => selectIndex(index)}
                >
                  <StationOption station={option} />
                  {isSelected && (
                    <svg className="station-select__check" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M4.5 10.5l3.5 3.5 7.5-8" fill="none" stroke="currentColor"
                        strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default StationSelect;
