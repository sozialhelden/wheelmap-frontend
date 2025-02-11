import { type MutableRefObject, forwardRef } from "react";

export const NoDataIcon = forwardRef(function NoDataIcon(props, ref) {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
    <svg
      {...props}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={ref as MutableRefObject<SVGSVGElement>}
    >
      <path d="M10 0L20 10L10 20L0 10L10 0Z" fill="#646464" />
    </svg>
  );
});
