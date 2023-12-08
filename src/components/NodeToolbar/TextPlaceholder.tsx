import styled from 'styled-components';
import colors, { alpha } from '../../lib/colors';

export const TextPlaceholder = styled.span.attrs({ 'aria-label': '' })`
  background-color: ${alpha(colors.linkColor, 0.2)};
  color: transparent;
  animation: pulse 1.5s infinite;
  @keyframes pulse {
    0% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.5;
    }
  }
`;
