import { useId } from 'react';
import '../styles/Select.css';

export function Select({
  label,
  options,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  required = false,
  id,
  name,
  className = '',
}) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const rootClass = ['select', className].filter(Boolean).join(' ');

  return (
    <div className={rootClass}>
      {label && (
        <label className="select__label" htmlFor={selectId}>
          {label}
          {required && <span className="select__required" aria-hidden="true"> *</span>}
        </label>
      )}

      <div className="select__control">
        <select
          id={selectId}
          name={name}
          className="select__field"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          required={required}
          aria-invalid={Boolean(error)}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>

        <svg className="select__chevron" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M5 7.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>  
  );
}

export default Select;
