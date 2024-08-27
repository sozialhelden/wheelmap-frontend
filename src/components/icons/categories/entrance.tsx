import React from 'react'

function SvgEntrance(props: React.SVGAttributes<{}>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 15 15" {...props}>
      <path
        d="M13.5 1.5v12c0 .3-.2.5-.5.5H2c-.3 0-.5-.2-.5-.5v-12c0-.3.2-.5.5-.5h11c.3 0 .5.2.5.5zM4 14h7v-1H4v1zm0-2h7V2H4v10zm-1 0V2c0-.3.2-.5.5-.5h11c.3 0 .5.2.5.5v10c0 .3-.2.5-.5.5H3.5c-.3 0-.5-.2-.5-.5z"
        fill="#000"
        fillRule="evenodd"
      />
    </svg>
  )
}

export default SvgEntrance
