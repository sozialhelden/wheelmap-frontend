import type React from "react";

function SvgGovernment(props: React.SVGAttributes<SVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      aria-hidden="true"
      viewBox="0 0 15 15"
      {...props}
    >
      <path
        d="M3 2v11h5v-3h3v3h1V2H3zm4 10H4v-2h3v2zm0-3H4V7h3v2zm0-3H4V4h3v2zm4 3H8V7h3v2zm0-3H8V4h3v2z"
        fill="#000"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default SvgGovernment;
