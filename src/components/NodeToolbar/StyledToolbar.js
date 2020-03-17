import styled, { css } from 'styled-components';
import Toolbar from '../Toolbar';
import { ChromelessButton } from '../Button';
import colors from '../../lib/colors';

const safeAreaBottomPadding = css`
  padding-bottom: 0px;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
`;

const ToolbarTopOffsets = {
  None: 0,
  TitleBar: 50,
  TitleBarAndSearch: 110,
};

function determineOffset(props, smallScreen?: boolean) {
  if (props.inEmbedMode) {
    return ToolbarTopOffsets.None;
  }

  return ToolbarTopOffsets.TitleBar;
}

const StyledToolbar = styled(Toolbar)`
  hyphens: auto;
  width: 100%;
  margin: 0;
  border-radius: 0;
  position: absolute;
  box-shadow: none;
  max-height: 100%;
  height: 100%;

  top: ${props => determineOffset(props)}px;
  top: calc(${props => determineOffset(props)}px + constant(safe-area-inset-top));
  top: calc(${props => determineOffset(props)}px + env(safe-area-inset-top));
  padding-top: 0;

  ${props => (props.isModal ? '' : safeAreaBottomPadding)}

  @media (max-width: 512px), (max-height: 512px) {
    top: ${props => determineOffset(props)}px;
    top: calc(${props => determineOffset(props)}px + constant(safe-area-inset-top));
    top: calc(${props => determineOffset(props)}px + env(safe-area-inset-top));
    margin: 0;
  }

  ${ChromelessButton}.expand-button {
    margin: 0 -10px;
    padding: 8px 10px;
    display: flex;
    justify-content: left;
    width: 100%;

    &.focus-visible {
      background-color: transparent;
    }

    &:hover {
      color: ${colors.linkColor};
      background-color: ${colors.linkBackgroundColorTransparent};
    }

    svg {
      width: 1.5rem;
      height: 1.5rem;
      fill: #89939e;
    }
  }
`;

export default StyledToolbar;
