import React from 'react';

const UnknownWithArrow = (props: any) => (
  <svg viewBox="0 0 25 25" width="1em" height="1em" {...props}>
    <path
      strokeOpacity={0.254}
      stroke="#000"
      d="M.707 12.501l11.794 11.794 11.798-11.79L12.5.708.707 12.5z"
      fill={props.fill}
      fillRule="evenodd"
    />
  </svg>
);

export default UnknownWithArrow;
