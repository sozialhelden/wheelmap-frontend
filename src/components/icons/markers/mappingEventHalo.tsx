import React from 'react';

const MappingEventHalo = (props: any) => (
  <svg viewBox="0 0 444 444" width="1em" height="1em" {...props}>
    <defs>
      <filter
        x="-75%"
        y="-75%"
        width="250%"
        height="250%"
        filterUnits="objectBoundingBox"
        id="mapping-event-halo-filter"
      >
        <feGaussianBlur stdDeviation={50} in="SourceGraphic" />
      </filter>
    </defs>
    <circle
      fill="#226BE59A"
      filter="url(#mapping-event-halo-filter)"
      cx={222}
      cy={222}
      r={100}
      fillRule="evenodd"
    />
  </svg>
);

export default MappingEventHalo;
