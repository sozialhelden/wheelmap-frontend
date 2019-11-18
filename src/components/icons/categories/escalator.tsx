import React from 'react';

const Escalator = (props: any) => (
  <svg viewBox="0 0 15 15" width="1em" height="1em" {...props}>
    <g fill="#000" fillRule="nonzero">
      <path d="M7 6.5v-1a1 1 0 1 0-2 0v3l2-2zm-2.35 4.06L5 3a1 1 0 1 1 2 0 1 1 0 0 1-2 0l-.35 7.56z" />
      <path d="M14 6a1 1 0 0 1-1 1h-1.58a1 1 0 0 0-.71.29l-5.42 5.42a1 1 0 0 1-.7.29H2a1 1 0 1 1 0-2h1.59a1 1 0 0 0 .7-.29l5.42-5.42a1 1 0 0 1 .71-.29H13a1 1 0 0 1 1 1z" />
    </g>
  </svg>
);

export default Escalator;
