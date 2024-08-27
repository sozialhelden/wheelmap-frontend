import React from 'react'

function SvgNoWithArrow(props: React.SVGAttributes<{}>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 25 25" {...props}>
      <path
        strokeOpacity={0.269}
        stroke="#000"
        strokeWidth={0.5}
        d="M21.75 21.75V3.322H3.25v18.497l6.747-.069.195.09 2.308 2.77 2.308-2.77.192-.09h6.75z"
        fillRule="nonzero"
        fill="none"
      />
    </svg>
  )
}

export default SvgNoWithArrow
