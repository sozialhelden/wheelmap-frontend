import type React from "react";

function SvgSubwayStation(props: React.SVGAttributes<SVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      aria-hidden="true"
      viewBox="0 0 15 15"
      {...props}
    >
      <path
        d="M7.5 17c4.142 0 7.5-4.253 7.5-9.5S11.642-2 7.5-2C3.358-2 0 2.253 0 7.5S3.358 17 7.5 17zm0-1c3.59 0 6.5-3.806 6.5-8.5S11.09-1 7.5-1 1 2.806 1 7.5 3.91 16 7.5 16zM6 2c-1.364 0-3 .743-3 2.746v5.255c0 .552.405 1.201.895 1.446L5 12v1h1v-1h3v1h1v-1l1.105-.553C11.6 11.2 12 10.55 12 9.995V4.746C12 2.701 10.764 2 9.4 2H6zM5 4h5c1 0 1 .967 1 .967V7s0 1-1 1H5C4 8 4 7 4 7V5s0-1 1-1zm.5 5a.5.5 0 110 1 .5.5 0 010-1zm4 0a.5.5 0 110 1 .5.5 0 010-1z"
        fill="#000"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default SvgSubwayStation;
