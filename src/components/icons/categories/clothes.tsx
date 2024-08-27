import React from 'react'

function SvgClothes(props: React.SVGAttributes<{}>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 15 15" {...props}>
      <path d="M3.5 1L0 4v3h2.9l.1 7h9V7h3V4l-3.5-3H10L7.5 5 5 1z" fill="#000" fillRule="evenodd" />
    </svg>
  )
}

export default SvgClothes
