const Button = ({ children, onClick, disabled, ariaLabel }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={ariaLabel}
    className="btn"
  >
    {children}
  </button>
); 