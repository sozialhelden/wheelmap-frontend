import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgEducation = (
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
      d="M7.5 2 0 5.5l2 .9v1.7c-.6.2-1 .8-1 1.4s.4 1.2 1 1.4v.1l-.9 2.1C.8 14 1 15 2.5 15s1.7-1 1.4-1.9L3 11c.6-.3 1-.8 1-1.5s-.4-1.2-1-1.4V6.9L7.5 9 15 5.5zm4.4 6.5-4.5 2L5 9.4v.1c0 .7-.3 1.3-.8 1.8l.6 1.4v.1c.1.4.2.8.1 1.2.7.3 1.5.5 2.5.5 3.3 0 4.5-2 4.5-3z"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgEducation);
export default ForwardRef;
