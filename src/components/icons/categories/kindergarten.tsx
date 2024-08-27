import React from 'react';

function SvgKindergarten(props: React.SVGAttributes<{}>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 15 15" {...props}>
      <path
        d="M7 6a1 1 0 110-2 1 1 0 010 2zm5 5h-1.5l-1-2L9 7.25 9.5 7l1.1.5a.539.539 0 00.4-1L9.5 6H8L6 7 5 8H4a.5.5 0 000 1h2l1-1 .5 1.5-1 1.61v2.39a.5.5 0 001 0v-2l1-1 1 1.5H12a.5.5 0 000-1zm-9 3a1 1 0 110-2 1 1 0 010 2zm10.5-9a.5.5 0 01-.22-.05L7.5 2 1.72 4.93A.514.514 0 011.28 4L7.5.92 13.72 4a.512.512 0 01-.22 1z"
        fill="#000"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default SvgKindergarten;
