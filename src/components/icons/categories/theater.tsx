import React from 'react'

function SvgTheater(props: React.SVGAttributes<{}>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 15 15" {...props}>
      <path
        d="M2 1.5s-1 0-1 1v5.158c0 1.73.354 3.842 3.5 3.842H5v-3l-2.5 1S2.5 7 5 7V5.5c0-.708.087-1.32.5-1.775.381-.42 1.005-1.258 2.656-.471L9 3.803V2.5s0-1-1-1c-.708 0-1.978 1-3 1s-2.213-1-3-1zm1 2a1 1 0 110 2 1 1 0 010-2zm4 1s-1 0-1 1v5c0 2 1 4 4 4s4-2 4-4v-5c0-1-1-1-1-1-.708 0-1.978 1-3 1s-2.213-1-3-1zm1 2a1 1 0 110 2 1 1 0 010-2zm4 0a1 1 0 110 2 1 1 0 010-2zm-4.5 4h5s0 2.5-2.5 2.5-2.5-2.5-2.5-2.5z"
        fill="#000"
        fillRule="evenodd"
      />
    </svg>
  )
}

export default SvgTheater
