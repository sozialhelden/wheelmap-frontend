// @flow
/* eslint-disable max-len */

import styled from 'styled-components';
import * as React from 'react';
import FocusTrap from '@sozialhelden/focus-trap-react';

type Props = {
  onClose: () => {},
  isVisible: boolean,
  className: string,
  ariaLabel: string,
  ariaDescribedBy: string,
  isKeyboardShown: boolean,
  isRenderedIfInvisible: boolean,
  children: React.Node,
};

function ModalDialog(props: Props) {
  const isVisible = props.isVisible;

  if (!isVisible && !props.isRenderedIfInvisible) {
    return null;
  }

  const hasKeyboard = props.isKeyboardShown;

  return (
    <FocusTrap
      component="section"
      className={`modal-dialog ${props.className} ${!isVisible ? 'modal-dialog-hidden' : ''}`}
      role="dialog"
      aria-label={props.ariaLabel}
      aria-describedby={props.ariaDescribedBy}
    >
      <div
        className={'modal-dialog-fullscreen-overlay'}
        onClick={props.onClose}
        aria-hidden="true"
      />
      <div className={`modal-dialog-inner ${hasKeyboard ? 'with-shown-keyboard' : ''}`}>
        <div className={'modal-dialog-content'}>
          <button className={'close-dialog'} onClick={props.onClose}>
            <svg width="0.5em" height="0.5em" viewBox="168 231 31 31" version="1.1">
              <polygon
                id="\xD7"
                stroke="none"
                fill="#000"
                opacity="0.8"
                fillRule="evenodd"
                points="180.121094 246.582031 168.90625 235.296875 172.351562 231.816406   183.601562 243.066406 194.957031 231.816406 198.4375 235.191406 187.046875 246.582031 198.367188 257.902344 194.957031 261.277344 183.601562 250.027344 172.351562 261.207031 168.976562 257.832031"
              />
            </svg>
          </button>
          {props.children}
        </div>
      </div>
    </FocusTrap>
  );
}

const StyledModalDialog = styled(ModalDialog)`
  z-index: 10000000000;

  &,
  .modal-dialog-fullscreen-overlay,
  .modal-dialog-inner {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: bottom 0.3s ease-out;
  }

  button.close-dialog {
    border: none;
    outline: none;
    position: absolute;
    left: 5px;
    top: 5px;
    font-size: 30px;
    line-height: 100%;
    width: 40px;
    height: 40px;
    padding: 10px;
    cursor: pointer;
    transform: scale3d(1, 1, 1);
    transition: transform 0.1s ease-out;
    user-select: none;
    -webkit-user-drag: none;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 100px;
    border: rgba(255, 255, 255, 0.24) 1px solid;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    z-index: 1000;
  }

  @media (max-width: 400px), (max-height: 400px) {
    button.close-dialog {
      right: 2px;
      top: 2px;
    }
  }

  button.close-dialog svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }
  button.close-dialog:hover {
    background-color: rgba(200, 200, 200, 0.8);
  }
  button.close-dialog:active {
    transform: scale3d(0.9, 0.9, 0.9);
    background-color: rgba(200, 200, 200, 0.8);
  }
  button.close-dialog:focus {
    background-color: rgba(200, 200, 200, 0.8);
  }
  .modal-dialog-fullscreen-overlay {
    background-color: rgba(255, 255, 255, 0.85);
  }
  .modal-dialog-default .modal-dialog-content {
    position: relative;
    box-sizing: border-box;
    overflow: auto;
    max-width: 40em;
    max-height: 100%;
    padding: 3em 1em 2em 1em;
    color: #333;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }
  .modal-dialog-default .modal-dialog-content h1 {
    margin: 0.5em 0;
    font-size: 2em;
  }
  .modal-dialog-default .modal-dialog-content button {
    border: none;
    outline: none;
    border-radius: 0;
  }
  .modal-dialog-default .modal-dialog-content button:hover,
  .modal-dialog-default .modal-dialog-content button:active {
    font-size: 1em;
    color: #fff;
  }
`;
export default StyledModalDialog;
