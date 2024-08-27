import React from 'react';

function SvgMusic(props: React.SVGAttributes<{}>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 15 15" {...props}>
      <path
        d="M13.5 1a.49.49 0 00-.23.06L4.5 3.5A.5.5 0 004 4v6.28A2 2 0 003 10a2 2 0 102 2V7.36l8-2.22v3.64a2 2 0 00-1-.28 2 2 0 102 2v-9a.5.5 0 00-.5-.5zM13 4.14L5 6.36v-2l8-2.22v2z"
        fill="#000"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default SvgMusic;
