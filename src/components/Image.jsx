function Image({
  fullWidth = false,
  className = '',
  ...props
}) {
  const url = props.src
  const alt = props.alt ?? 'Image'

  return (
    <img className={`ui-image ${
      fullWidth ? 'ui-image-full' : ''
    } ${className}`.trim()} src={url} alt={alt} />
  )
}

export default Image
