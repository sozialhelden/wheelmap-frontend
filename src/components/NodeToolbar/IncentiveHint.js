import styled from 'styled-components';
import colors from '../../lib/colors';

const color = colors.editHintBackgroundColor;
// const color = colors.linkColor;

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

  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  max-width: 7rem;
  margin-left: 1rem;
  padding: 0.25em;
  border: none;
  border-radius: 0.25em;
  text-align: center;
  font-size: 90%;
  font-weight: 300;
  color: white;
  opacity: 0;
  background: ${color};
  animation: slideIn 1.5s 1s ease-out forwards;
  text-shadow: 0 0px 1px rgba(0, 0, 0, 0.5);

  &:before {
    content: '';
    display: block;
    position: absolute;
    left: -16px;
    top: 50%;
    margin-top: -8px;
    width: 16px;
    height: 16px;
    border: 8px solid transparent;
    border-right-color: ${color};
    box-sizing: border-box;
  }
`;
