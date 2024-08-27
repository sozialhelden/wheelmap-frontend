import React from 'react';

function SvgCablecar(props: React.SVGAttributes<{}>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 15 15" {...props}>
      <path
        d="M13 5H8V2.6a1 1 0 00.42-.46l5.08-.64a.5.5 0 000-1l-5.22.65a1 1 0 00-.78-.4 1 1 0 00-.92.62L1.5 2a.5.5 0 000 1l5.22-.65c.077.1.172.185.28.25V5H2a1 1 0 00-1 1v7a1 1 0 001 1h11a1 1 0 001-1V6a1 1 0 00-1-1zm-6 6H3V7h4v4zm5 0H8V7h4v4z"
        fill="#000"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default SvgCablecar;
