import * as React from "react";
import type { SVGProps } from "react";
import { type Ref, forwardRef } from "react";
const SvgAccommodation = (
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
      d="M.5 2.5c-.3 0-.5.2-.5.5v9.5c0 .3.2.5.5.5s.5-.2.5-.5V11h13v1.5c0 .3.2.5.5.5s.5-.2.5-.5v-2c0-.3-.2-.5-.5-.5H1V3c0-.3-.2-.5-.5-.5m3 .5C2.7 3 2 3.7 2 4.5S2.7 6 3.5 6 5 5.3 5 4.5 4.3 3 3.5 3M7 4C5.5 4 5.5 5.5 5.5 5.5V7h-3c-.3 0-.5.2-.5.5v1c0 .3.2.5.5.5H15V6.5C15 4 12.5 4 12.5 4z"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgAccommodation);
export default ForwardRef;
