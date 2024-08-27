import React from 'react';

function SvgCinema(props: React.SVGAttributes<{}>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 15 15" {...props}>
      <path
        d="M14 8.5v2a.5.5 0 01-1 0s.06-.5-1-.5h-1v2.5a.5.5 0 01-.5.5h-8a.5.5 0 01-.5-.5v-4a.5.5 0 01.5-.5h8a.5.5 0 01.5.5V9h1c1.06 0 1-.5 1-.5a.5.5 0 011 0zM4 4a2 2 0 100 4 2 2 0 000-4zm0 3a1 1 0 110-2 1 1 0 010 2zm4.5-4a2.5 2.5 0 100 5 2.5 2.5 0 000-5zm0 4a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"
        fill="#000"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default SvgCinema;
