import * as React from 'react';
import includes from 'lodash/includes';
import styled from 'styled-components';
import { isTouchDevice } from '../../lib/userAgent';

type Props = {
  caption: string,
  onActivate: (event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>) => void,
  isHidden?: boolean,
  ariaHidden?: boolean,
  topPosition: number,
  color: string,
  className?: string,
};

function NotificationButton(props: Props) {
  const classNames = [
    props.isHidden && 'is-hidden',
    isTouchDevice() && 'is-touch-device',
    props.className,
  ].filter(Boolean);

  return (
    <button
      className={classNames.join(' ')}
      onKeyDown={event => {
        if (includes(['Enter', ' '], event.key)) {
          props.onActivate(event);
        }
      }}
      onClick={props.onActivate}
      tabIndex={-1}
      aria-hidden={props.ariaHidden}
    >
      <span>{props.caption}</span>
    </button>
  );
}

const StyledNotificationButton = styled(NotificationButton)`
  display: inline-flex;
  position: absolute;
  right: 70px;
  top: ${props => props.topPosition}px;
  max-width: 130px; /* Ensure the block does not overlap the search bar */
  z-index: 1000;
  border: none;
  border-radius: 4px;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.2);
  color: rgba(0, 0, 0, 0.7);
  background-color: ${props => props.color};
  cursor: pointer;
  text-align: center;
  opacity: 1;
  transform-origin: right;
  transform: scale3d(1, 1, 1);
  transition: opacity 0.3s ease-out, transform 0.3s ease-out;

  &.is-hidden {
    opacity: 0;
    transform: scale3d(1.3, 1.3, 1.3);
    pointer-events: none;
  }

  span {
    padding: 4px 8px;
    background: ${props => props.color};
    color: white;
    z-index: 1;
    border-radius: 4px;
    font-size: 0.9rem;
    font-weight: 300;
    text-shadow: 0 0px 1px rgba(0, 0, 0, 0.5);
  }

  &:not(.is-touch-device) {
    ::before {
      border-color: rgba(0, 0, 0, 0.15);
    }
    ::before,
    ::after {
      content: '';
      position: absolute;
      border-style: solid;
      display: block;
      width: 0;
      left: 100%;
      border-width: 7px 0 7px 7px;
      border-top-color: transparent !important;
      border-bottom-color: transparent !important;
    }
  }

  ::before {
    filter: blur(2px);
    top: 16px;
  }

  ::after {
    top: 14px;
    border-width: 5px 0 5px 5px;
    border-color: ${props => props.color};
  }

  @media (max-width: 1024px) {
    top: ${props => props.topPosition + 50}px;
  }

  @media (max-width: 500px), (max-height: 500px) {
    /* On small viewports, move button down to make space for category view */
    position: fixed;
    max-width: 150px;
    top: unset;
    right: unset;
    bottom: 30px;
    margin-bottom: constant(safe-area-inset-bottom);
    margin-bottom: env(safe-area-inset-bottom);
    left: 50%;
    transform-origin: center center;
    transform: translate(-50%, 0);

    &.is-hidden {
      transform: translate(-50%, 0) scale3d(1.3, 1.3, 1.3);
    }

    &::before,
    &::after {
      opacity: 0;
    }
  }
`;

export default StyledNotificationButton;
