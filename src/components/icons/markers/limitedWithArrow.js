import React from "react";

const LimitedWithArrow = props => (
  <svg
    viewBox="0 0 25 25"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="1em"
    height="1em"
    {...props}
  >
    <defs>
      <path
        id="a"
        d="M18.276 22.026l5.775-10.003-5.775-10.004H6.724L.95 12.023l5.775 10.003h2.748l3.023 3.028 3.025-3.025z"
      />
    </defs>
    <g fill="none" fillRule="evenodd">
      <path
        strokeOpacity={0.269}
        stroke="#000"
        strokeWidth={0.5}
        d="M18.131 21.776l5.632-9.753-5.632-9.754H6.87l-5.632 9.754 5.632 9.753h2.603l.177.074 2.846 2.85 2.848-2.848.177-.073 2.611-.003z"
      />
    </g>
  </svg>
);

export default LimitedWithArrow;

