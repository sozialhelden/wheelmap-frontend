import React from 'react'

function SvgSwimming(props: React.SVGAttributes<{}>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 15 15" {...props}>
      <path
        d="M10.111 2c-.112 0-.435.146-.435.146l-3.322 1.68c-.443.176-.618.882-.352 1.235l.97 1.408-3.97 2.029L5 9.998l2.502-1.5 2.5 1.5 1.002-1.002-3-4 2.557-1.53c.528-.265.443-.704.443-.97C11 2.286 10.644 2 10.111 2zm2.141 3a1.75 1.75 0 10-.003 3.501A1.75 1.75 0 0012.252 5zM2.5 10L0 11.5V13l2.5-1.5L5 13l2.502-1.5 2.5 1.5L12 11.5l3 1.5v-1.5L12 10l-1.998 1.5-2.5-1.5L5 11.5 2.5 10z"
        fill="#000"
        fillRule="evenodd"
      />
    </svg>
  )
}

export default SvgSwimming
