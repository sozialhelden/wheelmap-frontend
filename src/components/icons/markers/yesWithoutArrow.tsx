import React from 'react';

const YesWithoutArrow = (props: any) => (
  <svg viewBox="0 0 25 25" width="1em" height="1em" {...props}>
    <circle cx={12.5} cy={12.5} r={10.5} fill={props.fill} fillRule="nonzero" />
  </svg>
);

export default YesWithoutArrow;
