import React from 'react';

function SvgMemorial(props: React.SVGAttributes<{}>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 15 15" {...props}>
      <path
        d="M7.5 0L6 2.5v7h3v-7L7.5 0zM3 11.5V15h9v-3.5L10.5 10h-6L3 11.5z"
        fill="#000"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default SvgMemorial;
