// @flow

import styled from 'styled-components';

const PlaceName = styled.h1`
  margin: 0 30px 0.5em 0;
  line-height: 1;
  font-weight: 400;
  display: flex;
  flex-direction: row;
  align-items: center;
  word-break: break-word;
  font-size: ${props => props.isSmall ? 'inherit' : '20px'};
  font-weight: ${props => props.isSmall ? '500' : '400'};

  figure {
    margin-right: 5px;
    margin-left: -5px;
  }
`;

export default PlaceName;
