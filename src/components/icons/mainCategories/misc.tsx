import React from 'react';

const SvgMisc = (props: React.SVGAttributes<{}>) => (
  <svg width="1em" height="1em" viewBox="0 0 15 15" {...props}>
    <circle cx={7.5} cy={7.5} r={4.5} fill="#000" fillRule="evenodd" />
  </svg>
);

export default SvgMisc;

