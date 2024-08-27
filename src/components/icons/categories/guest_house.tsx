import React from 'react';

function SvgGuestHouse(props: React.SVGAttributes<{}>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 15 15" {...props}>
      <path
        d="M14 7H1a11.431 11.431 0 011-4h11a11.429 11.429 0 011 4zM3 8h9v6h-1V9H8v5H3V8zm1 3h3V9H4v2z"
        fill="#000"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default SvgGuestHouse;
