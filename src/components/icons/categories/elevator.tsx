import type React from "react";

function SvgElevator(props: React.SVGAttributes<SVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      aria-hidden="true"
      viewBox="0 0 15 15"
      {...props}
    >
      <g fill="#000" fillRule="evenodd">
        <path
          d="M2 1.017v13h7.134v-13H2zm0-1h7.134a1 1 0 011 1v13a1 1 0 01-1 1H2a1 1 0 01-1-1v-13a1 1 0 011-1z"
          fillRule="nonzero"
        />
        <path d="M15.303 6.419a.399.399 0 00.564-.005.41.41 0 00.004-.57l-2.15-2.168a.2.2 0 00-.285 0l-2.15 2.168a.41.41 0 00.004.57.399.399 0 00.563.005l1.725-1.763 1.725 1.763zM11.853 8.494a.399.399 0 00-.563.005.41.41 0 00-.005.57l2.152 2.167a.2.2 0 00.284 0l2.15-2.168a.41.41 0 00-.004-.57.399.399 0 00-.564-.004l-1.724 1.763-1.726-1.763z" />
        <path
          d="M7.045 12.634V6.88c0-.712-.67-1.29-1.498-1.29-.827 0-1.497.578-1.497 1.29v5.754H5V10.75h1v1.884h1.045zM5.547 2.12a1.478 1.478 0 110 2.955 1.478 1.478 0 010-2.955z"
          fillRule="nonzero"
        />
      </g>
    </svg>
  );
}

export default SvgElevator;
