import type React from "react";

function SvgNoWithoutArrow(props: React.SVGAttributes<SVGElement>) {
  return (
    <svg
      width="1em"
      aria-hidden="true"
      height="1em"
      viewBox="0 0 25 25"
      {...props}
    >
      <path d="M22 22V3.072H3v19z" fill="#F54B4B" fillRule="nonzero" />
    </svg>
  );
}

export default SvgNoWithoutArrow;
