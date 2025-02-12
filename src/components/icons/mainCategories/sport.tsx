import * as React from "react";
import type { SVGProps } from "react";
import { type Ref, forwardRef } from "react";
const SvgSport = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d="M11 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0 9.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2m1.84-4.91-1.91-1.91a.48.48 0 0 0-.37-.18H3.5a.5.5 0 0 0 0 1h2.7L3 11.3a.5.5 0 0 0 0 .2.511.511 0 0 0 1 .21L5 10h2l-1.93 4.24a.5.5 0 0 0-.07.26.51.51 0 0 0 1 .2l4.7-9.38 1.44 1.48a.5.5 0 0 0 .7-.71"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgSport);
export default ForwardRef;
