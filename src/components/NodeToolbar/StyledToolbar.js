import styled from 'styled-components';
import Toolbar from '../Toolbar';

const StyledToolbar = styled(Toolbar)`
  hyphens: auto;

  top: ${props => (props.inEmbedMode ? 0 : 110)}px;
  top: calc(${props => (props.inEmbedMode ? 0 : 110)}px + constant(safe-area-inset-top));
  top: calc(${props => (props.inEmbedMode ? 0 : 110)}px + env(safe-area-inset-top));
  max-height: calc(100% - ${props => (props.inEmbedMode ? 70 : 120)}px);
  max-height: calc(
    100% - ${props => (props.inEmbedMode ? 70 : 120)}px - constant(safe-area-inset-top)
  );
  max-height: calc(100% - ${props => (props.inEmbedMode ? 70 : 120)}px - env(safe-area-inset-top));
  padding-top: 0;

  @media (max-width: 512px), (max-height: 512px) {
    top: ${props => (props.inEmbedMode ? 0 : 50)}px;
    top: calc(${props => (props.inEmbedMode ? 0 : 50)}px + constant(safe-area-inset-top));
    top: calc(${props => (props.inEmbedMode ? 0 : 50)}px + env(safe-area-inset-top));

    @media (orientation: landscape) {
      max-height: calc(100% - ${props => (props.inEmbedMode ? 0 : 80)}px);
      max-height: calc(
        100% - ${props => (props.inEmbedMode ? 0 : 80)}px - constant(safe-area-inset-top)
      );
      max-height: calc(
        100% - ${props => (props.inEmbedMode ? 0 : 80)}px - env(safe-area-inset-top)
      );
    }
  }
`;

export default StyledToolbar;
