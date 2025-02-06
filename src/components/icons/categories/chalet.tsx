import type React from "react";

function SvgChalet(props: React.SVGAttributes<SVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      aria-hidden="true"
      viewBox="0 0 15 15"
      {...props}
    >
      <path
        d="M2 15V8l5.5-4L13 8v7H2zm4-5h3v5H6v-5zm7.695-2.604l.61-.792-6.808-5.237L.19 7.107l.618.786 6.694-5.26 6.192 4.763z"
        fill="#000"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default SvgChalet;
