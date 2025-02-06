import type React from "react";

function SvgBar(props: React.SVGAttributes<SVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      aria-hidden="true"
      viewBox="0 0 15 15"
      {...props}
    >
      <path
        d="M7.535 1c-2 0-7 .25-6.5.75l6 6.25v4c0 1-3 .5-3 2h7c0-1.5-3-1-3-2V8l6-6.25c.5-.5-4.5-.75-6.5-.75zm0 1c2.5 0 4.75.25 4.75.25l-.75.75h-8l-.75-.75S5.035 2 7.535 2z"
        fill="#000"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default SvgBar;
