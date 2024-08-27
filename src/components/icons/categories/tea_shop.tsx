import React from 'react';

function SvgTeaShop(props: React.SVGAttributes<{}>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 15 15" {...props}>
      <path
        d="M11 6c-.2 1.4-.5 2.7-1 4-.3.4-.6.7-1 1v2H6v-2c-.4-.3-.7-.6-1-1-.5-1.3-.8-2.6-1-4h7zM8.1 4.7c1.2-.3 1.7-.3 1.8-1.5 0-.6-.4-.8-1.5-1.4-.9-.4-1.3-1-1.2-1.8C6.8.9 7 2 8 2.5c2 1 .1 2.2.1 2.2zM5.8 5c.7-.2 1.1-.2 1.1-.9 0-.4-.3-.5-.9-.9-.6-.2-.9-.7-.8-1.2-.3.6-.1 1.3.5 1.6 1.2.6.1 1.4.1 1.4z"
        fill="#000"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default SvgTeaShop;
