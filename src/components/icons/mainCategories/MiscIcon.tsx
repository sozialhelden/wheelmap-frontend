import { type MutableRefObject, forwardRef } from "react";

export const MiscIcon = forwardRef(function MiscIcon(props, ref) {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 15 15"
      {...props}
      ref={ref as MutableRefObject<SVGSVGElement>}
    >
      <circle cx={7.5} cy={7.5} r={4.5} fill="#000" fillRule="evenodd" />
    </svg>
  );
});
