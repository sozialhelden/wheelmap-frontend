import React from 'react'

function SvgUndefined(props: React.SVGAttributes<{}>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 15 15" {...props}>
      <path
        d="M6.464 9.304h2.064c-.192-1.904 2.208-2.496 2.208-4.48 0-1.888-1.36-2.736-3.168-2.736-1.184 0-2.192.592-2.912 1.456l1.296 1.184c.432-.432.864-.736 1.456-.736.64 0 1.072.352 1.072 1.008 0 1.2-2.336 2.112-2.016 4.304zM6.08 11.72c0 .832.592 1.472 1.408 1.472s1.424-.64 1.424-1.472c0-.848-.608-1.488-1.424-1.488s-1.408.64-1.408 1.488z"
        fill="#010101"
        fillRule="evenodd"
      />
    </svg>
  )
}

export default SvgUndefined
