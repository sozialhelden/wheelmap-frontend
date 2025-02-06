import type React from "react";

function SvgEvent(props: React.SVGAttributes<SVGElement>) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 54 72"
      width="1em"
      height="1em"
      {...props}
    >
      <g fill="none">
        <ellipse
          fill="#000"
          opacity={0.1}
          cx={27.5}
          cy={69.5}
          rx={3.5}
          ry={2}
        />
        <path
          d="M8.971 42.338C3.633 37.012 0 30.628 0 26.87 0 12.03 12.088 0 27 0s27 12.03 27 26.87c0 3.767-3.32 9.95-8.352 15.18L27.716 69 8.97 42.338z"
          fill="#2D6AE0"
        />
        <path d="M8.75 36.5V30a5 5 0 0110 0v6.5" stroke="#FFF" />
        <circle stroke="#FFF" cx={14.5} cy={18.5} r={3.5} />
        <path d="M36 36.5V30a5 5 0 0110 0v6.5" stroke="#FFF" />
        <circle stroke="#FFF" cx={41.75} cy={18.5} r={3.5} />
        <path d="M22 30.5V24a5 5 0 0110 0v6.5" stroke="#FFF" />
        <circle stroke="#FFF" cx={27.75} cy={12.5} r={3.5} />
      </g>
    </svg>
  );
}

export default SvgEvent;
