import * as React from 'react';

function SvgComponent(props) {
  return (
    <svg width={41} height={16} viewBox="0 0 41 16" {...props}>
      <title>{'Group 6'}</title>
      <g fill="#3F6BD8" fillRule="evenodd">
        <text
          fontFamily="SFProDisplay-Medium, SF Pro Display"
          fontSize={24}
          fontWeight={400}
          letterSpacing={0}
          transform="translate(-2 -8)"
        >
          <tspan x={0.564} y={23}>
            {'+'}
          </tspan>
        </text>
        <path d="M23.448 3.13L25.334.55c.253-.303.79-.549 1.194-.549h5.944c.407 0 .942.246 1.193.549l1.887 2.581h3.965c.819 0 1.483.622 1.483 1.39V14.61C41 15.38 40.337 16 39.518 16H19.48C18.663 16 18 15.378 18 14.611V4.521c0-.769.663-1.39 1.482-1.39H23.448zM30 15a5 5 0 100-10 5 5 0 000 10zm0-1a4 4 0 110-8 4 4 0 010 8zM20 2.5c0-.827.332-1.5.75-1.5h1.5c.414 0 .75.666.75 1.5V4h-3V2.5zM36.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
      </g>
    </svg>
  );
}

export default SvgComponent;
