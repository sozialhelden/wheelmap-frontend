import type React from "react";

function SvgInstruments(props: React.SVGAttributes<SVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      aria-hidden="true"
      viewBox="0 0 15 15"
      {...props}
    >
      <path
        d="M13.33 7H11.5l-.39-2.33A2 2 0 009.7 3.18 3.76 3.76 0 008.62 3H6.38a3.76 3.76 0 00-1.08.18 2 2 0 00-1.41 1.49L3.5 7H1.67a.5.5 0 00-.48.65l1.88 6.3A1.5 1.5 0 004.5 15h6a1.5 1.5 0 001.42-1.05l1.88-6.3a.5.5 0 00-.47-.65zM4.52 7l.36-2.17a.91.91 0 01.74-.7c.246-.078.502-.121.76-.13h2.24c.261.008.52.051.77.13a.91.91 0 01.74.7L10.48 7h-6 .04z"
        fill="#000"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default SvgInstruments;
