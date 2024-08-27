import React from 'react';

function SvgUniversity(props: React.SVGAttributes<{}>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 15 15" {...props}>
      <path
        d="M7.5 0L0 3.5l2 .9v1.7c-.6.2-1 .8-1 1.4 0 .6.4 1.2 1 1.4V9l-.9 2.1C.8 12 1 13 2.5 13s1.7-1 1.4-1.9L3 9c.6-.3 1-.8 1-1.5s-.4-1.2-1-1.4V4.9L7.5 7 15 3.5 7.5 0zm4.4 6.5l-4.5 2L5 7.4v.1c0 .7-.3 1.3-.8 1.8l.6 1.4v.1c.1.4.2.8.1 1.2.7.3 1.5.5 2.5.5 3.3 0 4.5-2 4.5-3v-3z"
        fill="#010101"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default SvgUniversity;
