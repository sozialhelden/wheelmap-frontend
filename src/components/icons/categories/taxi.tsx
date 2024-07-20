import React from "react";

const SvgTaxi = (props: React.SVGAttributes<{}>) => (
  <svg
    baseProfile="tiny"
    viewBox="0 0 50 50"
    overflow="inherit"
    width="1em"
    height="1em"
    {...props}
  >
    <path d="M45.7 24.15l-7.89-13.29c-.31-.58-1.07-.85-1.72-.85H29v-6c0-1.1-.9-2-2-2h-5c-1.1 0-2 .9-2 2v6h-5.96c-.65 0-1.44.27-1.75.85l-7.92 13.4c-1.3 0-2.37.99-2.37 2.32v12.14c0 1.34 1.06 2.29 2.37 2.29h2.64v3.78c0 2 1.33 3.22 3.28 3.22h1.18c1.95 0 3.54-1.22 3.54-3.22v-3.78h20v3.78c0 2 1.71 3.22 3.67 3.22h1.18c1.95 0 3.15-1.22 3.15-3.22v-3.78h2.76c1.3 0 2.24-.95 2.24-2.29V26.58c0-1.33-1-2.43-2.3-2.43zM8.51 33.86c-1.63 0-2.96-1.36-2.96-3.03 0-1.68 1.32-3.03 2.96-3.03s2.96 1.36 2.96 3.04-1.32 3.03-2.96 3.03zm1.77-9.85l5.38-9.38c.29-.6 1.06-.62 1.71-.62h15.38c.65 0 1.42.03 1.71.62l5.39 9.38H10.28zm31.34 9.86c-1.63 0-2.96-1.36-2.96-3.03 0-1.68 1.33-3.03 2.96-3.03s2.96 1.36 2.96 3.04-1.32 3.03-2.96 3.03z" />
  </svg>
);

export default SvgTaxi;
