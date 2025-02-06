import type React from "react";

function SvgBrothel(props: React.SVGAttributes<SVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      aria-hidden="true"
      viewBox="0 0 15 15"
      {...props}
    >
      <path
        d="M8 6h2V5H8V4H7v1H6c-.556 0-1 .447-1 .999v1.002c0 .556.447.999.999.999H7v1H5v1h2v1h1v-1h1.491c.559 0 1.009-.447 1.009-.999V7.999A.996.996 0 009.501 7H8V6zM7 6H6v1h1V6zm1 3h1.5V8H8v1zm5.906-1.25c-1.17 2.25-4.299 5.31-6.068 6.94a.5.5 0 01-.67 0C5.388 13.06 2.26 10 1.09 7.75-1.48 2.8 4.999-.95 7.498 4c2.5-4.95 8.978-1.2 6.408 3.75z"
        fill="#000"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default SvgBrothel;
