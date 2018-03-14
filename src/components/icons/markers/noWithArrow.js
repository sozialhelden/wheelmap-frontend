import React from "react";

const NoWithArrow = props => (
  <svg
    viewBox="0 0 25 25"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="1em"
    height="1em"
    {...props}
  >
    <defs>
      <path id="a" d="M22 22V3.072H3v19L10 22l2.5 3 2.5-3z" />
    </defs>
    <g fillRule="nonzero" fill="none">
      <path
        strokeOpacity={0.269}
        stroke="#000"
        strokeWidth={0.5}
        d="M21.75 21.75V3.322H3.25v18.497l6.747-.069.195.09 2.308 2.77 2.308-2.77.192-.09h6.75z"
      />
    </g>
  </svg>
);

export default NoWithArrow;

