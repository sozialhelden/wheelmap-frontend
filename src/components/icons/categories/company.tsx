import type React from "react";

function SvgCompany(props: React.SVGAttributes<SVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      aria-hidden="true"
      viewBox="0 0 15 15"
      {...props}
    >
      <path
        d="M11 5V3c0-1-1-1-1-1H5.05S3.946 2.002 4 3v2H3S2 5 2 6v6c0 1 1 1 1 1h9s1 0 1-1V6c0-1-1-1-1-1h-1zM5.5 3.5h4V5h-4V3.5z"
        fillRule="nonzero"
        fill="#000"
      />
    </svg>
  );
}

export default SvgCompany;
