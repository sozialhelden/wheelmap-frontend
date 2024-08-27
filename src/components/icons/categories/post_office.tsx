import React from 'react'

function SvgPostOffice(props: React.SVGAttributes<{}>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 15 15" {...props}>
      <path
        d="M14 5.5V11a1 1 0 01-1 1H2a1 1 0 01-1-1V5.5a.5.5 0 01.5-.5.49.49 0 01.21 0L7.5 9l5.8-4a.488.488 0 01.2 0 .5.5 0 01.5.5zM1.25 2.92l.08.08L7.5 7l6.19-4h.06a.49.49 0 00.25-.5.5.5 0 00-.5-.5h-12a.5.5 0 00-.5.5.49.49 0 00.25.42z"
        fill="#000"
        fillRule="evenodd"
      />
    </svg>
  )
}

export default SvgPostOffice
