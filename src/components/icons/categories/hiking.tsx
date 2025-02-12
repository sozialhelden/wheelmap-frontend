import type React from "react";

function SvgHiking(props: React.SVGAttributes<SVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      aria-hidden="true"
      viewBox="0 0 15 15"
      {...props}
    >
      <path
        d="M7.5 1c-.3 0-.4.2-.6.4l-5.8 9.5c-.1.1-.1.3-.1.4 0 .5.4.7.7.7h11.6c.4 0 .7-.2.7-.7 0-.2 0-.2-.1-.4L8.2 1.4C8 1.2 7.8 1 7.5 1zm0 1.5L10.8 8H10L8.5 6.5 7.5 8l-1-1.5L5 8h-.9l3.4-5.5z"
        fill="#000"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default SvgHiking;
