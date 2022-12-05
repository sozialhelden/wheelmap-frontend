import { createGlobalStyle } from 'styled-components';

export const LeafletLocateControlStyle = createGlobalStyle`
/* Compatible with Leaflet 0.7 */
.leaflet-control-locate {
  a {
    font-size: 1.4em;
    color: #444;
    cursor: pointer;
  }
  &.active {
    a {
      color: #2074B6;
    }
    &.following a {
      color: #FC8428;
    }
  }
}
`;
