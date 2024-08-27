import React from 'react';

function SvgUnknownWithoutArrow(props: React.SVGAttributes<{}>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 25 25" {...props}>
      <path
        strokeOpacity={0.25}
        stroke="#000"
        d="M.707 12.5l11.794 11.793 11.798-11.79L12.5.707.707 12.5z"
        fill="none"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default SvgUnknownWithoutArrow;
