import React from "react";

const SvgRailwayStation = (props: React.SVGAttributes<{}>) => (
  <svg viewBox="0 0 15 15" width="1em" height="1em" {...props}>
    <path d="M5.75 12.5l-.25.5h4l-.25-.5h1.5L12 15h-1.5l-.5-1H5l-.5 1H3l1.25-2.5h1.5zM13 3v7c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h7c1.1 0 2 .9 2 2zM9 9.5c0 .55.45 1 1 1s1-.45 1-1-.45-1-1-1-1 .45-1 1zm-3 0c0-.55-.45-1-1-1s-1 .45-1 1 .45 1 1 1 1-.45 1-1zm-3-6l.01 3c0 .28.23.5.5.5h3c.27 0 .5-.22.5-.5l-.02-3c0-.28-.22-.5-.5-.5H3.5c-.28 0-.5.22-.5.5zm5 0l.01 3c0 .28.23.5.5.5h3c.27 0 .5-.22.5-.5l-.02-3c0-.28-.22-.5-.5-.5H8.5c-.28 0-.5.22-.5.5z" />
  </svg>
);

export default SvgRailwayStation;

