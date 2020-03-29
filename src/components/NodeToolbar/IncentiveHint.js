import styled from 'styled-components';
import colors from '../../lib/colors';

const color = colors.editHintBackgroundColor;

export const IncentiveHint = styled.span.attrs({ className: 'incentive-hint' })`
  @keyframes slideIn {
    0% {
      opacity: 0;
      transform: translate3d(-2px, 0, 0);
    }
    100% {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  display: flex;
  justify-content: center;
  align-items: center;

  max-width: 7rem;
  padding: 0.25em;
  border: none;
  border-radius: 0.25em;
  text-align: center;
  font-size: 90%;
  font-weight: 500;
  color: white;
  opacity: 0;
  background: ${color};
  animation: slideIn 1.5s 1s ease-out forwards;

  &:before {
    content: '';
    display: block;
    position: absolute;
    right: 16px;
    bottom: -16px;
    margin-top: -8px;
    width: 16px;
    height: 16px;
    border: 8px solid transparent;
    border-top-color: ${color};
    box-sizing: border-box;
  }
`;
