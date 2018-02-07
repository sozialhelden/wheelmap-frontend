// @flow

import { t } from 'c-3po';
import * as React from 'react';
import styled from 'styled-components';
import ModalDialog from '../ModalDialog';
import ChevronRight from '../icons/actions/ChevronRight';
import colors from '../../lib/colors';
import { accessibilityDescription, accessibilityName } from '../../lib/Feature';
import Logo from '../../lib/Logo';
import Icon from '../Icon';


type Props = {
  className: string,
  isVisible: boolean,
  onClose: (() => void),
};

const preventTabbing = event => {
  if (event.key === 'Tab') {
    event.preventDefault();
  }
}

function Onboarding(props: Props) {
  // translator: Shown on the onboarding screen. To visit it, open Wheelmap in an incognito window.
  const claim = t`Mark and find wheelchair accessible places—worldwide and for free. It’s easy with our traffic light system:`;
  // translator: Shown on the onboarding screen. To visit it, open Wheelmap in an incognito window.
  const unknownAccessibilityIncentiveText = t`Help out by marking places!`;
  // translator: Button caption shown on the onboarding screen. To visit it, open Wheelmap in an incognito window.
  const startButtonCaption = t`Okay, let’s go!`;

  const manageFocus = buttonElement => {
    if (!buttonElement) {
      return;
    }

    buttonElement.addEventListener('keydown', preventTabbing);
    buttonElement.focus();
  }

  return (<ModalDialog
    className={props.className}
    isVisible={props.isVisible}
    onClose={props.onClose}
    ariaDescribedBy='wheelmap-claim-onboarding wheelmap-icon-descriptions'
    ariaLabel={t`Wheelmap start screen`}
  >
    <header>
      <Logo className="logo" ariaHidden={true}/>
      <p id="wheelmap-claim-onboarding">{claim}</p>
    </header>

    <section>
      <ul id="wheelmap-icon-descriptions">
        <li className="ac-marker-yes">
          <Icon accessibility="yes" category={{ _id: 'other' }} size='big' withArrow shadowed />
          <header>{accessibilityName('yes')}</header>
          <footer>{accessibilityDescription('yes')}</footer>
        </li>
        <li className="ac-marker-limited">
          <Icon accessibility="limited" category={{ _id: 'other' }} size='big' withArrow shadowed />
          <header>{accessibilityName('limited')}</header>
          <footer>{accessibilityDescription('limited')}</footer>
        </li>
        <li className="ac-marker-no">
          <Icon accessibility="no" category={{ _id: 'other' }} size='big' withArrow shadowed />
          <header>{accessibilityName('no')}</header>
          <footer>{accessibilityDescription('no')}</footer>
        </li>
        <li className="ac-marker-unknown">
          <Icon accessibility="unknown" category={{ _id: 'other' }} size='big' withArrow shadowed />
          <header>{accessibilityName('unknown')}</header>
          <footer>{unknownAccessibilityIncentiveText}</footer>
        </li>
      </ul>
    </section>

    <footer>
      <button className="button-cta-close focus-ring" onClick={props.onClose} ref={manageFocus} >
        {startButtonCaption}
        <ChevronRight />
      </button>
    </footer>
  </ModalDialog>);
}


const StyledOnboarding = styled(Onboarding)`
  @media (max-height: 320px), (max-width: 320px) {
    font-size: 90%;
  }

  .modal-dialog-fullscreen-overlay {
    background-color: transparent;
  }

  .close-dialog {
    display: none;
  }

  .modal-dialog-content {
    display: flex;
    flex-direction: row;
    max-width: 90%;
    padding: 15px;
    overflow: auto;
    border-radius: 20px;
    background-color: rgba(255, 255, 255, 0.92);
    box-shadow: 0 5px 30px rgba(0, 0, 0, 0.15);

    .logo {
      width: 250px;
      height: auto;
    }

    @media (max-width: 1199px) {
      flex-direction: column !important;
      > footer, > header {
        text-align: center;
        width: 75%;
        margin: 0 12.5%;
      }
    }

    @media (min-width: 1200px) {
      justify-content: center;
      align-items: center;
      max-width: 1200px;

      > header, footer {
        flex: 1;
        display: flex;
        justify-content: center;
      }
      header {
        flex-direction: column;
      }
      > section {
        flex: 2;
      }
    }

    ul {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: start;
      list-style-type: none;
      margin: 50px 0;
      padding: 0px;
      @media (max-width: 768px) {
        margin: 10px 0 !important;
      }
      @media (max-width: 400px) {
        flex-direction: column !important;
      }

      li {
        flex: 1;
        display: flex;
        flex-direction: column;

        justify-content: space-around;
        align-items: center;
        text-align: center;
        background-color: transparent;

        @media (max-width: 400px) {
          height: 4em;
          flex-direction: row !important;
          text-align: left !important;
          padding: 0 10px !important;
          figure {
            margin-right: 10px;
            width: 40px;
            height: 40px;
          }
        }

        &.ac-marker-yes {
          color: ${colors.positiveColorDarker};
        }

        &.ac-marker-limited {
          color: ${colors.warningColorDarker};
        }

        &.ac-marker-no {
          color: ${colors.negativeColorDarker};
        }

        &.ac-marker-unknown {
          color: ${colors.markers.foreground.unknown};
          .ac-big-icon-marker {
            background-color: ${colors.markers.background.unknown};
          }
        }

        header {
          margin-bottom: 10px;
          @media (max-width: 768px) {
            margin-bottom: 0px !important;
            flex: 1;
          }
          @media (min-width: 769px) {
            height: 3em;
          }
          min-height: 2em;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        footer {
          font-size: 90%;
          opacity: 0.7;
          display: none;
        }

      }
    }

    button.button-cta-close {
      border: none;
      color: white;
      background-color: ${colors.linkColor};
      font-size: 1.25em;
      line-height: 1;
      padding: 0.5em 0.75em;
      margin: 1em;
      cursor: pointer;
      > svg {
        margin-left: 10px;
      }

      &.focus-ring {
        box-shadow: 0px 0px 0px 4px ${colors.selectedColorLight};
        transition: box-shadow 0.2s;
      }
    }

    .ac-big-icon-marker {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      transform: none;
      animation: none;
      margin: 15px;
      left: auto;
      top: auto;
      svg {
        opacity: 0.6;
      }
    }
  }
`;

export default StyledOnboarding;


export function saveOnboardingFlag() {
  localStorage.setItem('wheelmap.onboardingCompleted', 'true');
}

export function isOnboardingVisible() {
  return localStorage.getItem('wheelmap.onboardingCompleted') !== 'true';
}
