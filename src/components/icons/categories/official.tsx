import type React from "react";

function SvgOfficial(props: React.SVGAttributes<SVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      aria-hidden="true"
      viewBox="0 0 15 15"
      {...props}
    >
      <path
        d="M3 3v11h5v-3h3v3h1V3H3zm4 10H4v-2h3v2zm0-3H4V8h3v2zm0-3H4V5h3v2zm4 3H8V8h3v2zm0-3H8V5h3v2z"
        fill="#000"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default SvgOfficial;
