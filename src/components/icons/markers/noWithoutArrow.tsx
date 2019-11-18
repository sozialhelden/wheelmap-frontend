import React from 'react';

const NoWithoutArrow = (props: any) => (
  <svg viewBox="0 0 25 25" width="1em" height="1em" {...props}>
    <path d="M22 22V3.072H3v19z" fill={props.fill} fillRule="nonzero" />
  </svg>
);

export default NoWithoutArrow;
