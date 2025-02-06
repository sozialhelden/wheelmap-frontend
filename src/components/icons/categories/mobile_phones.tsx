import type React from "react";

function SvgMobilePhones(props: React.SVGAttributes<SVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      aria-hidden="true"
      viewBox="0 0 15 15"
      {...props}
    >
      <path
        d="M4.51 8.88a.51.51 0 000 .72l.72.72-2.16 2.18-.37-.37a2.24 2.24 0 01-.7-1.44V9.24a2.24 2.24 0 01.7-1.45l.36-.36 4.35-4.35.36-.36A2.24 2.24 0 019.22 2h1.45a2.24 2.24 0 011.45.72l.36.36-2.17 2.18-.73-.73a.51.51 0 00-.72 0L4.51 8.88zm.34 4l-.72.72a1 1 0 001.45 0l.72-.72a1 1 0 000-1.45l-.72.72-.73.73zm8-8l-.75.72-.72.72a1 1 0 001.45 0l.72-.72a1 1 0 000-1.45l-.7.73z"
        fill="#000"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default SvgMobilePhones;
