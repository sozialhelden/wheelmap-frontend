import React from 'react'

function SvgTrain(props: React.SVGAttributes<{}>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 15 15" {...props}>
      <path
        d="M3 1a1 1 0 00-1 1v8a1 1 0 001 1h9a1 1 0 001-1V2a1 1 0 00-1-1H3zm2.75.5h3.51a.25.25 0 110 .5H5.75a.25.25 0 110-.5zM3.5 3H7v4H3.5a.5.5 0 01-.5-.5v-3a.5.5 0 01.5-.5zM8 3h3.5a.5.5 0 01.5.5v3a.5.5 0 01-.5.5H8V3zM5 8a1 1 0 110 2 1 1 0 010-2zm5 0a1 1 0 110 2 1 1 0 010-2zm.445 3.994a.504.504 0 00-.425.676l.17.33H4.81l.13-.27a.5.5 0 00-.91-.41l-1 2a.487.487 0 00-.03.18.5.5 0 00.5.5.49.49 0 00.43-.26v-.05H4l.31-.69h6.38l.31.69v.05a.49.49 0 00.43.26.5.5 0 00.5-.5.49.49 0 000-.24l-1-2a.5.5 0 00-.485-.266z"
        fill="#000"
        fillRule="evenodd"
      />
    </svg>
  )
}

export default SvgTrain
