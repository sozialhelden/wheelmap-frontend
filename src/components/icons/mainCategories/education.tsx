import React from 'react'

function SvgEducation(props: React.SVGAttributes<{}>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 15 15" {...props}>
      <path
        d="M7.5 2L0 5.5l2 .9v1.7c-.6.2-1 .8-1 1.4 0 .6.4 1.2 1 1.4v.1l-.9 2.1C.8 14 1 15 2.5 15s1.7-1 1.4-1.9L3 11c.6-.3 1-.8 1-1.5s-.4-1.2-1-1.4V6.9L7.5 9 15 5.5 7.5 2zm4.4 6.5l-4.5 2L5 9.4v.1c0 .7-.3 1.3-.8 1.8l.6 1.4v.1c.1.4.2.8.1 1.2.7.3 1.5.5 2.5.5 3.3 0 4.5-2 4.5-3v-3z"
        fill="#010101"
        fillRule="evenodd"
      />
    </svg>
  )
}

export default SvgEducation
