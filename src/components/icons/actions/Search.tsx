import React from 'react';

function SvgSearch(props: React.SVGAttributes<{}>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 15 15" {...props}>
      <path
        d="M6.979 10.098l-4.757 4.778L.056 12.7l4.777-4.798a5.38 5.38 0 01-.621-2.517C4.212 2.41 6.612 0 9.572 0c2.961 0 5.361 2.41 5.361 5.385 0 2.973-2.4 5.384-5.36 5.384-.941 0-1.826-.243-2.594-.671zm2.594-.675c2.22 0 4.02-1.808 4.02-4.038 0-2.23-1.8-4.039-4.02-4.039-2.22 0-4.02 1.808-4.02 4.039 0 2.23 1.8 4.038 4.02 4.038z"
        fill="#000"
        fillRule="evenodd"
        opacity={0.283}
      />
    </svg>
  );
}

export default SvgSearch;
