import React from "react";

const YesWithArrow = props => (
  <svg
    viewBox="0 0 25 25"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="1em"
    height="1em"
    {...props}
  >
    <defs>
      <path
        d="M9.64 22.11C5.23 20.865 2 16.812 2 12.004c0-5.799 4.701-10.5 10.5-10.5S23 6.205 23 12.004c0 4.777-3.19 8.81-7.556 10.082L12.53 25l-2.89-2.89z"
        id="a"
      />
    </defs>
    <g fill="none" fillRule="evenodd">
      <path
        strokeOpacity={0.269}
        stroke="#000"
        strokeWidth={0.5}
        d="M12.53 24.646l2.737-2.737.107-.063a10.254 10.254 0 0 0 7.376-9.842c0-5.66-4.59-10.25-10.25-10.25S2.25 6.344 2.25 12.004c0 4.618 3.08 8.629 7.458 9.865l.109.064 2.713 2.713z"
      />
    </g>
  </svg>
);

export default YesWithArrow;

