import type React from "react";

function SvgGardenCenter(props: React.SVGAttributes<SVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      aria-hidden="true"
      viewBox="0 0 15 15"
      {...props}
    >
      <path
        d="M4 5v-.5a2.5 2.5 0 015 0v5.793l2.365-2.365-.347-1.295-.001-.006h-.001a.5.5 0 01.838-.481l2 2a.5.5 0 01-.479.838.126.126 0 00-.01-.003l-1.293-.346L9 11.707V12a1 1 0 01-1 1H5a1 1 0 01-1-1v-.464L1.732 9.268a2.503 2.503 0 010-3.536A2.493 2.493 0 013.5 5H4zm0 1h-.5a1.5 1.5 0 00-1.061 2.561L4 10.121V6zm4-1v-.5a1.5 1.5 0 00-3 0V5h3z"
        fill="#000"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default SvgGardenCenter;
