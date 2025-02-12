import type React from "react";

function SvgShareIos(props: React.SVGAttributes<SVGElement>) {
  return (
    <svg
      width="1em"
      aria-hidden="true"
      height="1em"
      viewBox="-3 0 18 27"
      {...props}
    >
      <path d="M10 4.414V15H8V4.414L5.707 6.707 4.293 5.293 9 .586l4.707 4.707-1.414 1.414L10 4.414zM6 9v2H2v14h14V11h-4V9h6v18H0V9h6z" />
    </svg>
  );
}

export default SvgShareIos;
