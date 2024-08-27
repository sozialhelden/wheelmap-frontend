import React from 'react';

function SvgFuel(props: React.SVGAttributes<{}>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 15 15" {...props}>
      <path
        d="M14 6v5.5a.5.5 0 01-1 0v-2A1.5 1.5 0 0011.5 8H10V2a1 1 0 00-1-1H3a1 1 0 00-1 1v11a1 1 0 001 1h6a1 1 0 001-1V9h1.5a.5.5 0 01.5.5v2a1.5 1.5 0 003 0V5a1 1 0 00-1-1V2.49a.5.5 0 00-.5-.49.51.51 0 00-.5.55V5a1 1 0 101-1v2zm-5 .5a.5.5 0 01-.5.5h-5a.5.5 0 01-.5-.5v-3a.5.5 0 01.5-.5h5a.5.5 0 01.5.5v3z"
        fill="#000"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default SvgFuel;
