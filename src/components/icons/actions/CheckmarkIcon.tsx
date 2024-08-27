import React from 'react';

function SvgCheckmarkIcon(props: React.SVGAttributes<{}>) {
  return (
    <svg width="1em" height="1em" viewBox="8 8 17 17" {...props}>
      <path
        d="M8.314 15.898c0-.42.15-.774.45-1.062.3-.288.66-.432 1.08-.432.42 0 .78.144 1.08.432l3.33 3.258 8.01-7.83c.3-.3.66-.45 1.08-.45.42 0 .78.144 1.08.432.3.288.45.642.45 1.062 0 .42-.15.774-.45 1.062l-9.09 8.91c-.288.3-.648.45-1.08.45-.432 0-.792-.15-1.08-.45l-4.428-4.302c-.288-.3-.432-.66-.432-1.08z"
        fill="#000"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default SvgCheckmarkIcon;
