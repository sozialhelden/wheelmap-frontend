import React from 'react'

function SvgPoliticalParty(props: React.SVGAttributes<{}>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 15 15" {...props}>
      <path
        d="M7.15 2C5.93 2 4.98 3.38 4.61 3.82a.49.49 0 00-.11.32v4.4a.44.44 0 00.72.36 3 3 0 011.93-1.17C8.56 7.73 9.1 9 10.57 9a5.28 5.28 0 002.73-1.09.49.49 0 00.2-.4V2.45a.44.44 0 00-.62-.45 5.75 5.75 0 01-2.31 1.06C9.1 3.08 8.62 2 7.15 2zM3 3a1 1 0 110-2 1 1 0 010 2zm.5 1v9.48a.5.5 0 01-1 0V4a.5.5 0 011 0z"
        fill="#000"
        fillRule="evenodd"
      />
    </svg>
  )
}

export default SvgPoliticalParty
