import React from 'react';

function SvgDormitory(props: React.SVGAttributes<{}>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 15 15" {...props}>
      <path
        d="M3 1v11h5V9h3v3h1V1H3zm4 10H4V9h3v2zm0-3H4V6h3v2zm0-3H4V3h3v2zm4 3H8V6h3v2zm0-3H8V3h3v2z"
        fill="#000"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default SvgDormitory;
