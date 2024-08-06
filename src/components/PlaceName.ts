import styled, { css } from 'styled-components';

const placeNameCSS = css`
  margin: 0;
  line-height: 1;
  font-weight: 400;
  display: flex;
  position: relative;
  flex-direction: row;
  align-items: center;
  word-break: break-word;

  figure {
    margin-right: 5px;
    margin-left: -3px;
    left: 0;
    top: 0;
  }
`;

export const PlaceNameH1 = styled.h1.attrs({ isSmall: false })`
  ${placeNameCSS}
  font-weight: ${props => (props.isSmall ? '500' : '400')};
  font-size: ${props => (props.isSmall ? 'inherit' : '20px')};
`;

export const PlaceNameHeader = styled.header.attrs({ isSmall: false })`
  ${placeNameCSS}
  font-weight: ${props => (props.isSmall ? '500' : '400')};
  font-size: ${props => (props.isSmall ? 'inherit' : '20px')};
`;

export const PlaceNameDiv = styled.div.attrs({ isSmall: false })`
  ${placeNameCSS}
  font-weight: ${props => (props.isSmall ? '500' : '400')};
  font-size: ${props => (props.isSmall ? 'inherit' : '1rem')};
`;