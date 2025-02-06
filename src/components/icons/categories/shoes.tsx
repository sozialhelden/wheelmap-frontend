import type React from "react";

function SvgShoes(props: React.SVGAttributes<SVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      aria-hidden="true"
      viewBox="0 0 15 15"
      {...props}
    >
      <path
        d="M1 12h13V7.509c0-.557-.36-.747-.87-.544 0 0 .07.497-2.63.035-2.7-.462-1.224-.225-1.224-.225-.428-.152-1.17-.057-1.656.206 0 0-1.48.848-3.12 1.519-1.64.67-3.055 1.162-3.055 1.162a1.138 1.138 0 00-.7 1.315L1 12z"
        fill="#000"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default SvgShoes;
