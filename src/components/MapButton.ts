import styled from 'styled-components';
import colors from '../lib/colors';

const MapButton = styled('button')`
  width: 40px;
  min-height: 40px;
  padding: 0;
  background-color: white;
  border-radius: 2px;
  outline: none;
  border: none;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  position: fixed;
  z-index: 500;
  cursor: pointer;
  &:hover,
  &:focus {
    background-color: ${colors.linkBackgroundColor};
  }
  header,
  footer {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
    width: 40px;
    height: 40px;
  }
  footer {
    position: absolute;
    top: 40px;
    svg {
      margin-top: 4px;
      margin-left: 4px;
    }
  }
  header {
    span {
      width: 22px;
      height: 22px;
      border: 1px solid rgba(0, 0, 0, 0.75);
      border-radius: 11px;
      box-sizing: border-box;
      color: rgba(0, 0, 0, 0.75);
    }
    svg {
      width: 28px;
    }
  }
`;

export default MapButton;
