function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...props
}) {
  return (
    <button
      className={`ui-button ui-button-${variant} ${
        fullWidth ? 'ui-button-full' : ''
      } ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button