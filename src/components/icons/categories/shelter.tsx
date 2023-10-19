import React from "react";

const SvgShelter = (props: React.SVGAttributes<{}>) => (
  <svg viewBox="0 0 15 15" width="1em" height="1em" {...props}>
    <path d="M4 4v10H2V4H1V2h13v2H4zm1 7h8v3h-1v-2H6v2H5v-3zm1-3h6v2.5H6V8z" />
  </svg>
);

export default SvgShelter;

