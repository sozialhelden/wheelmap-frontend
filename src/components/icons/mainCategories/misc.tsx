import type React from "react";

function SvgMisc(props: React.SVGAttributes<SVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      aria-hidden="true"
      viewBox="0 0 15 15"
      {...props}
    >
      <circle cx={7.5} cy={7.5} r={4.5} fill="#000" fillRule="evenodd" />
    </svg>
  );
}

export default SvgMisc;
