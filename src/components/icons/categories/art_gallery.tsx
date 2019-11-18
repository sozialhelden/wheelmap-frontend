import React from 'react';

const ArtGallery = (props: any) => (
  <svg viewBox="0 0 15 15" width="1em" height="1em" {...props}>
    <path
      d="M10.71 3L7.85.15a.5.5 0 0 0-.707-.003L7.14.15 4.29 3H1.5a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h12a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-2.79zM7.5 1.21L9.29 3H5.71L7.5 1.21zM13 12H2V4h11v8zM5 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm7 4H4.5L6 8l1.25 2.5L9.5 6l2.5 5z"
      fill="#000"
      fillRule="evenodd"
    />
  </svg>
);

export default ArtGallery;
