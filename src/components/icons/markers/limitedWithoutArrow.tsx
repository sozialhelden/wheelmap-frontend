import React from 'react'

function SvgLimitedWithoutArrow(props: React.SVGAttributes<{}>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 25 25" {...props}>
      <path
        fill="#FC9B32"
        d="M6.743 2.364h11.55l5.776 10.003-5.775 10.003H6.743L.967 12.367z"
        fillRule="evenodd"
      />
    </svg>
  )
}

export default SvgLimitedWithoutArrow
