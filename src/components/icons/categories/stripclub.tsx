import React from 'react';

function SvgStripclub(props: React.SVGAttributes<{}>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 15 15" {...props}>
      <path
        d="M8 5h2V4H8V3H7v1H6c-.556 0-1 .447-1 .999v1.002c0 .556.447.999.999.999H7v1H5v1h2v1h1V9h1.491c.559 0 1.009-.447 1.009-.999V6.999A.996.996 0 009.501 6H8V5zM7 5H6v1h1V5zm1 3h1.5V7H8v1zm5.906-1.25c-1.17 2.25-4.299 5.31-6.068 6.94a.5.5 0 01-.67 0C5.388 12.06 2.26 9 1.09 6.75-1.48 1.8 4.999-1.95 7.498 3c2.5-4.95 8.978-1.2 6.408 3.75z"
        fill="#000"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default SvgStripclub;
