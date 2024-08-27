import React from 'react';

function SvgLaundry(props: React.SVGAttributes<{}>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 15 15" {...props}>
      <path
        d="M8 1L6 3H3S2 3 2 4v9c0 1 1 1 1 1h9s1 0 1-1V2c0-1-1-1-1-1H8zm.5 1h2a.499.499 0 110 1h-2a.499.499 0 110-1zm-1 4a3 3 0 110 6 3 3 0 010-6z"
        fill="#000"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default SvgLaundry;
