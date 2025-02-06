import type React from "react";

function SvgCoffee(props: React.SVGAttributes<SVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      aria-hidden="true"
      viewBox="0 0 15 15"
      {...props}
    >
      <path
        d="M13 5h-2V3H3v4a4 4 0 007.45 2H13a2 2 0 100-4zm0 3h-2.14A4 4 0 0011 7V6h2a1 1 0 110 2zm-2 4.5a.5.5 0 01-.5.5h-7a.5.5 0 010-1h7a.5.5 0 01.5.5z"
        fill="#000"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default SvgCoffee;
