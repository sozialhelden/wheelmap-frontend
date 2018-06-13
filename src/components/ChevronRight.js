// @flow

import styled from 'styled-components';
import * as React from 'react';


type Props = {
  className: string,
};

const ChevronRight = styled((props: Props) => (<svg className={`chevron-right ${props.className}`} viewBox="0 0 5 12" version="1.1">
  <polygon points="0 0 1 0 5 5.5 1 11.3333333 0 11.3333333 4 5.5" />
</svg>))`
  display: inline-block;
  margin: 0 5px;
  opacity: 0.5;
  min-width: 7px;
  width: 7px;
  height: 18px;

  polygon {
    fill: ${props => props.color || 'black'};
  }
`;

export default ChevronRight;
