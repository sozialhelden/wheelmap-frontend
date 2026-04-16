import { type MutableRefObject, type SVGProps, forwardRef } from "react";

export const NotWheelchairAccessibleIcon = forwardRef<
  SVGSVGElement,
  SVGProps<SVGSVGElement>
>(function NotWheelchairAccessibleIcon(props, ref) {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
    <svg
      {...props}
      width="16"
      height="20"
      viewBox="0 0 16 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={ref as MutableRefObject<SVGSVGElement>}
    >
      <rect y="2" width="16" height="16" fill="#CE2C31" />
    </svg>
  );
});
