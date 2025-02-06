import type React from "react";

function SvgDrinkingwater(props: React.SVGAttributes<SVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      aria-hidden="true"
      viewBox="0 0 15 15"
      {...props}
    >
      <g fill="#000" fillRule="evenodd">
        <path d="M6 1a2 2 0 00-2 2v3.5a.5.5 0 00.5.5h2a.5.5 0 00.5-.5v-2a.5.5 0 01.5-.5H14V1H6zM7 15H4a.5.5 0 01-.48-.38L2 8.62A.5.5 0 012.5 8h6a.5.5 0 01.5.62l-1.5 6A.5.5 0 017 15zm-3.35-4h3.71l.5-2H3.14l.51 2z" />
      </g>
    </svg>
  );
}

export default SvgDrinkingwater;
