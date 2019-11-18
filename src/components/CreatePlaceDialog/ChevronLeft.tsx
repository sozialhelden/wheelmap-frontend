import * as React from 'react';
import colors from '../../lib/colors';

export default function ChevronLeft(props: any) {
  return (
    <svg width="12px" height="30px" viewBox="0 0 24 59" version="1.1" {...props}>
      <g
        id="Page-1"
        stroke="none"
        strokeWidth="1"
        fill={colors.tonedDownSelectedColor}
        fillRule="evenodd"
      >
        <polygon points="19.0749351 0.817290107 23.7991461 0.817290107 5.32606215 28.6563909 23.7991461 58.1827099 19.0749351 58.1827099 0.601851111 28.6563909" />
      </g>
    </svg>
  );
}
