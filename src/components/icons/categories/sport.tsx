import type React from "react";

function SvgSport(props: React.SVGAttributes<SVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      aria-hidden="true"
      viewBox="0 0 15 15"
      {...props}
    >
      <path
        d="M11 1.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm0 9.5a1 1 0 100 2 1 1 0 000-2zm1.84-4.91l-1.91-1.91a.48.48 0 00-.37-.18H3.5a.5.5 0 000 1h2.7L3 11.3a.488.488 0 000 .2.511.511 0 001 .21L5 10h2l-1.93 4.24a.49.49 0 00-.07.26.51.51 0 001 .2l4.7-9.38 1.44 1.48a.5.5 0 00.7-.71z"
        fill="#000"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default SvgSport;
