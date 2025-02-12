import type React from "react";

function SvgPetStore(props: React.SVGAttributes<SVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      aria-hidden="true"
      viewBox="0 0 15 15"
      {...props}
    >
      <path
        d="M10.9 11.6c-.3-.6-.3-2.3 0-2.8.4-.6 3.4 1.4 3.4 1.4.9.4.9-6.1 0-5.7 0 0-3.1 2.1-3.4 1.4-.3-.7-.3-2.1 0-2.8.3-.6 4.1-.7 4.1-.7 0-.7-2.9-1.4-4.1-1.4-1.2 0-2.5.1-4.1.8-1.6.6-2.9 1.6-4.1 2.8C1.5 5.8 0 8.2 0 8.9c0 .7 1.5 2.8 3.7 3.7 2.2.9 3.3 1.1 4.5 1.3 1.1.1 2.6 0 3.9-.3 1-.2 2.9-.7 2.9-1.1 0-.2-3.8-.3-4.1-.9zM4.5 9.3C3.7 9.3 3 8.6 3 7.8s.7-1.5 1.5-1.5S6 7 6 7.8s-.7 1.5-1.5 1.5z"
        fill="#010101"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default SvgPetStore;
