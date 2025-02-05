import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgTourism = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 15 15"
    ref={ref}
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M11 4H4a1 1 0 0 1-1-1V.5a.5.5 0 0 1 1 0V2h1V1a1 1 0 1 1 2 0v1h1V1a1 1 0 1 1 2 0v1h1V.5a.5.5 0 0 1 1 0V3a1 1 0 0 1-1 1m3 10.5a.5.5 0 0 1-.5.5h-12a.5.5 0 0 1 0-1H2a1 1 0 0 0 1-1s1-6 1-7a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1c0 1 1 7 1 7a1 1 0 0 0 1 1h.5a.5.5 0 0 1 .5.49zm-5-4a1.5 1.5 0 0 0-3 0V14h3z"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgTourism);
export default ForwardRef;
