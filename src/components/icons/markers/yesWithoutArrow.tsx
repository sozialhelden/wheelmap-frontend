import React from 'react';

function SvgYesWithoutArrow(props: React.SVGAttributes<{}>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 25 25" {...props}>
      <circle cx={12.5} cy={12.5} r={10.5} fill="#7EC512" fillRule="nonzero" />
    </svg>
  );
}

export default SvgYesWithoutArrow;
