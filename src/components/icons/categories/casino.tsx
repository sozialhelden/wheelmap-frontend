import React from 'react';

function SvgCasino(props: React.SVGAttributes<{}>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 15 15" {...props}>
      <g fill="#000" fillRule="evenodd">
        <path d="M8.107 2.56c.06 0 .122.01.184.025l4.922 1.255a.859.859 0 01.622 1.02L12.017 13.2a.791.791 0 01-.978.613l-3.44-.877L10 12.5l-.019-.098 1.039.264 1.702-7.81-4.391-1.118-.224-1.179z" />
        <path d="M1.017 3.873a.806.806 0 01.648-.965l4.997-.895a.843.843 0 01.975.674l1.667 8.374a.806.806 0 01-.649.965l-4.997.895a.843.843 0 01-.975-.674L1.017 3.873zM3.7 11.788l4.479-.802-1.56-7.84-4.48.802 1.561 7.84z" />
      </g>
    </svg>
  );
}

export default SvgCasino;
