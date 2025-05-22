import type React from "react";

function SvgMappingEventHalo(props: React.SVGAttributes<SVGElement>) {
  return (
    <svg
      width="1em"
      aria-hidden="true"
      height="1em"
      viewBox="0 0 444 444"
      {...props}
    >
      <defs>
        <filter
          x="-75%"
          y="-75%"
          width="250%"
          height="250%"
          filterUnits="objectBoundingBox"
          id="mappingEventHalo_svg__a"
        >
          <feGaussianBlur stdDeviation={50} in="SourceGraphic" />
        </filter>
      </defs>
      <circle
        fill="#226BE59A"
        filter="url(#mappingEventHalo_svg__a)"
        cx={222}
        cy={222}
        r={100}
        fillRule="evenodd"
      />
    </svg>
  );
}

export default SvgMappingEventHalo;
