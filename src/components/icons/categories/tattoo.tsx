import React from 'react';

function SvgTattoo(props: React.SVGAttributes<{}>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 15 15" {...props}>
      <path
        d="M7 12.972V5.95a2.5 2.5 0 111 0v7.022C10.667 12.667 12 10 12 10l1 1s-1.5 3-5.5 3c-3.24 0-4.84-2.297-5.33-3.17L1 12V9h3l-1 1s1.333 2.667 4 2.972zM7.5 5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM11 9h3v3l-3-3z"
        fill="#000"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default SvgTattoo;
