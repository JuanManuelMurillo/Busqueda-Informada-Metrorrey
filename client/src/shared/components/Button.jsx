import '../styles/Button.css';


export function Button({
  children,
  variant = 'primary',
  isLoading = false,
  loadingText,
  disabled = false,
  type = 'button',
  className = '',
  ...rest
}) {
  const classes = ['button', `button--${variant}`, className].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...rest}
    >
      {isLoading && <span className="button__spinner" aria-hidden="true" />}
      {isLoading && loadingText ? loadingText : children}
    </button>
  );
}

export default Button;
