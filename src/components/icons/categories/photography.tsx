import type React from "react";

function SvgPhotography(props: React.SVGAttributes<SVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      aria-hidden="true"
      viewBox="0 0 15 15"
      {...props}
    >
      <path
        d="M6 2c-.554 0-.752.504-1 1l-.5 1h-2C1.669 4 1 4.669 1 5.5v5c0 .831.669 1.5 1.5 1.5h10c.831 0 1.5-.669 1.5-1.5v-5c0-.831-.669-1.5-1.5-1.5h-2L10 3c-.25-.5-.446-1-1-1H6zM2.5 5a.5.5 0 110 1 .5.5 0 010-1zm5 0a3 3 0 110 6 3 3 0 010-6zm0 1.5a1.5 1.5 0 000 3 1.5 1.5 0 000-3z"
        fill="#000"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default SvgPhotography;
