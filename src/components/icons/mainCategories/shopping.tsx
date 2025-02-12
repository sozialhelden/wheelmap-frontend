import * as React from "react";
import type { SVGProps } from "react";
import { type Ref, forwardRef } from "react";
const SvgShopping = (
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
      d="M13.2.5s-1.391-.041-1.946.5c-.534.52-.754.918-.754 2H1.2l1.394 4.814q.006.012.013.022c.235.657.848 1.13 1.579 1.158L4.199 9h6.5v.2s.001.3-.199.7-.3.6-1.1.6H2.9c-1 0-1 1.5 0 1.5h6.4c1.2 0 2.1-.7 2.4-1.4s.3-1.3.3-1.3V3c0-.524.229-1 .7-1h.55a.75.75 0 0 0 0-1.5zM9.2 12c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1m-5 0c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgShopping);
export default ForwardRef;
