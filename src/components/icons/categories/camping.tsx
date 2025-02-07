import type React from "react";

function SvgCamping(props: React.SVGAttributes<SVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      aria-hidden="true"
      viewBox="0 0 15 15"
      {...props}
    >
      <path
        d="M7 1.5l-5.5 9H1c-1 0-1 1-1 1v1s0 1 1 1h13c1 0 1-1 1-1v-1s0-1-1-1h-.5L8 1.5c-.2-.4-.8-.4-1 0zM7.5 5l3.2 5.5H4.2L7.5 5z"
        fill="#010101"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default SvgCamping;
