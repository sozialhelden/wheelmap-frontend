import React from "react";

const UnknownWithArrow = props => (
  <svg
    viewBox="0 0 25 25"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="1em"
    height="1em"
    {...props}
  >
    <defs>
      <path id="a" d="M3.663 3.661h17.678l.001 8.92v8.764l-17.678-.006z" />
    </defs>
    <g transform="rotate(-45 12.503 12.503)" fill="none" fillRule="evenodd">
      <use fill="#E6E4E0" xlinkHref="#a" />
      <path
        strokeOpacity={0.254}
        stroke="#000"
        d="M4.163 4.161v16.678l16.68.006L20.84 4.16H4.163z"
      />
    </g>
  </svg>
);

export default UnknownWithArrow;

