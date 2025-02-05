import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgGovernment = (
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
      d="M3 2v11h5v-3h3v3h1V2zm4 10H4v-2h3zm0-3H4V7h3zm0-3H4V4h3zm4 3H8V7h3zm0-3H8V4h3z"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgGovernment);
export default ForwardRef;
