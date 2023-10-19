import React from "react";

const SvgStop = (props: React.SVGAttributes<{}>) => (
  <svg viewBox="0 0 15 15" width="1em" height="1em" {...props}>
    <path d="M10.5 0L15 4.5v6L10.5 15h-6L0 10.5v-6L4.5 0h6z" />
  </svg>
);

export default SvgStop;

