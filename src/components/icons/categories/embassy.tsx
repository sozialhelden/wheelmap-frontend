import React from 'react';

function SvgEmbassy(props: React.SVGAttributes<{}>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 15 15" {...props}>
      <path
        d="M6.65 3C5.43 3 4.48 4.38 4.11 4.82a.49.49 0 00-.11.32v4.4a.44.44 0 00.72.36 3 3 0 011.93-1.17C8.06 8.73 8.6 10 10.07 10a5.28 5.28 0 002.73-1.09.49.49 0 00.2-.4V3.45a.44.44 0 00-.62-.45 5.75 5.75 0 01-2.31 1.06C8.6 4.08 8.12 3 6.65 3zM2.5 4a1 1 0 110-2 1 1 0 010 2zM3 5v9.48a.5.5 0 01-1 0V5a.5.5 0 011 0z"
        fill="#000"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default SvgEmbassy;
