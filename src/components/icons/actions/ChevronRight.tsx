import React from 'react';

function SvgChevronRight(props: React.SVGAttributes<{}>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 5 12" {...props}>
      <path d="M0 0h1l4 5.5-4 5.833H0L4 5.5z" fill="#000" fillRule="evenodd" />
    </svg>
  );
}

export default SvgChevronRight;
