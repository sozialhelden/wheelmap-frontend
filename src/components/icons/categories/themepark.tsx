import React from 'react';

function SvgThemepark(props: React.SVGAttributes<{}>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 15 15" {...props}>
      <path
        d="M2 1S1 1 1 2v5.158C1 8.888 1.354 11 4.5 11H5V8L2.5 9s0-2.5 2.5-2.5V5c0-.708.087-1.32.5-1.775.381-.42 1.005-1.258 2.656-.471L9 3.303V2s0-1-1-1c-.708 0-1.978 1-3 1S2.787 1 2 1zm1 2a1 1 0 110 2 1 1 0 010-2zm4 1S6 4 6 5v5c0 2 1 4 4 4s4-2 4-4V5c0-1-1-1-1-1-.708 0-1.978 1-3 1S7.787 4 7 4zm1 2a1 1 0 110 2 1 1 0 010-2zm4 0a1 1 0 110 2 1 1 0 010-2zm-4.5 4h5s0 2.5-2.5 2.5S7.5 10 7.5 10z"
        fill="#000"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default SvgThemepark;
