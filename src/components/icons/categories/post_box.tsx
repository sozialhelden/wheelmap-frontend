import React from "react";

const SvgPostBox = (props: React.SVGAttributes<{}>) => (
  <svg viewBox="0 0 15 15" width="1em" height="1em" {...props}>
    <path d="M9 1C6.5 1 5 3 5 5v9.5c0 .5 2 .5 2 0V12h4v2.5c0 .5 2 .5 2 0V5c0-2-1.5-4-4-4zM1.5 1l2 4C3.5 3 4 1.5 6 1H1.5z" />
  </svg>
);

export default SvgPostBox;

