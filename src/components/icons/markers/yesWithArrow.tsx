import React from 'react';

const YesWithArrow = (props: any) => (
  <svg viewBox="0 0 25 25" width="1em" height="1em" {...props}>
    <path
      strokeOpacity={0.269}
      stroke="#000"
      strokeWidth={0.5}
      d="M12.53 24.646l2.737-2.737.107-.063a10.254 10.254 0 0 0 7.376-9.842c0-5.66-4.59-10.25-10.25-10.25S2.25 6.344 2.25 12.004c0 4.618 3.08 8.629 7.458 9.865l.109.064 2.713 2.713z"
      fill={props.fill}
      fillRule="evenodd"
    />
  </svg>
);

export default YesWithArrow;
