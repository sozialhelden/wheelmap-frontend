import type React from "react";

function SvgPublicArt(props: React.SVGAttributes<SVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      aria-hidden="true"
      viewBox="0 0 15 15"
      {...props}
    >
      <path
        d="M6.353 12H4v3h7v-3H6.737 12v-1H7.08c.58-1.542 1.497-3.281 2.753-3.579 2.334-.553-1.166-1.105-1.75-1.658C7.5 5.211 11 3 11 3S6.917 4.105 5.75 5.21C4.583 6.317 4 10.185 4 10.185s3.5-3.868 2.917-3.316c-.33.312-.473 2.386-.535 4.132H3v1h3.353c-.02.871-.02 1.5-.02 1.5s.135-.637.404-1.5zM7 4a1 1 0 100-2 1 1 0 000 2z"
        fill="#000"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default SvgPublicArt;
