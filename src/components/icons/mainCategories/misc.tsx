import * as React from "react";
import type { SVGProps } from "react";
import { type Ref, forwardRef } from "react";
const SvgMisc = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 15 15"
    aria-hidden="true"
    ref={ref}
    {...props}
  >
    <circle cx={7.5} cy={7.5} r={4.5} fill="currentColor" fillRule="evenodd" />
  </svg>
);
const ForwardRef = forwardRef(SvgMisc);
export default ForwardRef;
