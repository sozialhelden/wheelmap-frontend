import React from 'react';

const MappingEventHalo = props => (
  <svg viewBox="0 0 444 444" width="1em" height="1em" {...props}>
    <defs>
      <filter x="-75%" y="-75%" width="250%" height="250%" filterUnits="objectBoundingBox" id="a">
        <feGaussianBlur stdDeviation={50} in="SourceGraphic" />
      </filter>
    </defs>
    <circle fill="#226BE5" filter="url(#a)" cx={222} cy={222} r={100} fillRule="evenodd" />
  </svg>
);

export default MappingEventHalo;
