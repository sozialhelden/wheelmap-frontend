import * as React from "react";
import type { SVGProps } from "react";
import { type Ref, forwardRef } from "react";
const SvgMoneyPost = (
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
      d="M1 3c-.554 0-1 .446-1 1v7c0 .554.446 1 1 1h13c.554 0 1-.446 1-1V4c0-.554-.446-1-1-1zm0 1h1.5a.5.5 0 1 1-.5.5l-.5.5a.5.5 0 1 1-.5.5zm6.5 0C8.88 4 10 5.567 10 7.5S8.88 11 7.5 11 5 9.433 5 7.5 6.12 4 7.5 4m5 0H14v1.5a.5.5 0 1 1-.5-.5l-.5-.5a.5.5 0 1 1-.5-.5m-5 1.5c-.323 0-.534.109-.682.25h1.364c-.148-.141-.359-.25-.682-.25m-.875.5c-.045.091-.062.171-.08.25h1.91c-.018-.079-.034-.159-.08-.25zm-.125.5v.25h2V6.5zm0 .5v.25h2V7zm0 .5v.25h2V7.5zm0 .5-.25.25h2L8.5 8zm-.5.5s.035.102.102.25h2.273L8 8.5zM1.5 9a.5.5 0 0 1 0 1l.5.5a.5.5 0 1 1 .5.5H1V9.5a.5.5 0 0 1 .5-.5m4.738 0c.046.086.076.159.137.25h2.268c.066-.138.107-.25.107-.25zM13.5 9a.5.5 0 0 1 .5.5V11h-1.5a.5.5 0 1 1 .5-.5l.5-.5a.5.5 0 0 1 0-1m-6.934.5q.118.138.26.25h1.42c.1-.077.188-.162.254-.25z"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgMoneyPost);
export default ForwardRef;
