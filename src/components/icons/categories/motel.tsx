import type React from "react";

function SvgMotel(props: React.SVGAttributes<SVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      aria-hidden="true"
      viewBox="0 0 15 15"
      {...props}
    >
      <path
        d="M14 6H1a11.431 11.431 0 011-4h11a11.429 11.429 0 011 4zM3 7h9v6h-1V8H8v5H3V7zm1 3h3V8H4v2z"
        fill="#000"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default SvgMotel;
