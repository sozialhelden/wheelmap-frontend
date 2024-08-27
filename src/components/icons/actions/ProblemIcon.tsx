import React from 'react';

function SvgProblemIcon(props: React.SVGAttributes<{}>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 33 33" {...props}>
      <g transform="translate(5 5)" fill="none" fillRule="evenodd">
        <path
          d="M12.367 1.508l9.771 16.994A1 1 0 0121.271 20H1.73a1 1 0 01-.867-1.498l9.771-16.994a1 1 0 011.734 0z"
          stroke="#000"
          strokeWidth={2}
        />
        <path
          d="M11.548 8.292v4.083"
          stroke="#000"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle fill="#000" cx={11.5} cy={16} r={1} />
      </g>
    </svg>
  );
}

export default SvgProblemIcon;
