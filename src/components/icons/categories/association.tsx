import type React from "react";

function SvgAssociation(props: React.SVGAttributes<SVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      aria-hidden="true"
      viewBox="0 0 15 15"
      {...props}
    >
      <path
        d="M5.65 3C4.43 3 3.48 4.38 3.11 4.82a.49.49 0 00-.11.32v4.4a.44.44 0 00.72.36 3 3 0 011.93-1.17C7.06 8.73 7.6 10 9.07 10a5.28 5.28 0 002.73-1.09.49.49 0 00.2-.4V3.45a.44.44 0 00-.62-.45 5.75 5.75 0 01-2.31 1.06C7.6 4.08 7.12 3 5.65 3zM1.5 4a1 1 0 110-2 1 1 0 010 2zM2 5v9.48a.5.5 0 01-1 0V5a.5.5 0 011 0z"
        fill="#000"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default SvgAssociation;
