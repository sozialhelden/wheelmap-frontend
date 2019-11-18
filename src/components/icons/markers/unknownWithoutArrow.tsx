import React from 'react';

const UnknownWithoutArrow = (props: any) => (
  <svg viewBox="0 0 25 25" width="1em" height="1em" {...props}>
    <path
      strokeOpacity={0.25}
      stroke="#000"
      d="M.707 12.5l11.794 11.793 11.798-11.79L12.5.707.707 12.5z"
      fill={props.fill}
      fillRule="evenodd"
    />
  </svg>
);

export default UnknownWithoutArrow;
