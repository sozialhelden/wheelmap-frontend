// @flow

import { t } from 'ttag';
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
  onClose: () => void,
};

function Onboarding(props: Props) {
  // translator: Shown on the onboarding screen. To visit it, open Wheelmap in an incognito window.
  const claim = t`Mark and find wheelchair accessible places — worldwide and for free. It’s easy with our traffic light system:`;
  // translator: Shown on the onboarding screen. To visit it, open Wheelmap in an incognito window.
  const unknownAccessibilityIncentiveText = t`Help out by marking places!`;
  // translator: Button caption shown on the onboarding screen. To visit it, open Wheelmap in an incognito window.
  const startButtonCaption = t`Okay, let’s go!`;

  const onClose = event => {
    // Prevent that touch up opens a link underneath the primary button after closing
    // the onboarding dialog
    setTimeout(() => props.onClose(), 10);
  };

  return (
    <ModalDialog
      className={props.className}
      isVisible={props.isVisible}
      onClose={props.onClose}
      ariaDescribedBy="wheelmap-claim-onboarding wheelmap-icon-descriptions"
      ariaLabel={t`Start screen`}
    >
      <header>
        <Logo className="logo" aria-hidden={true} />
        <p id="wheelmap-claim-onboarding">{claim}</p>
      </header>

      <section>
        <ul id="wheelmap-icon-descriptions">
          <li className="ac-marker-yes">
            <Icon
              accessibility="yes"
              category={{ _id: 'other' }}
              isMainCategory
              size="big"
              withArrow
              shadowed
              centered
            />
            <header>{accessibilityName('yes')}</header>
            <footer>{accessibilityDescription('yes')}</footer>
          </li>
          <li className="ac-marker-limited">
            <Icon
              accessibility="limited"
              category={{ _id: 'other' }}
              isMainCategory
              size="big"
              withArrow
              shadowed
              centered
            />
            <header>{accessibilityName('limited')}</header>
            <footer>{accessibilityDescription('limited')}</footer>
          </li>
          <li className="ac-marker-no">
            <Icon
              accessibility="no"
              category={{ _id: 'other' }}
              isMainCategory
              size="big"
              withArrow
              shadowed
              centered
            />
            <header>{accessibilityName('no')}</header>
            <footer>{accessibilityDescription('no')}</footer>
          </li>
          <li className="ac-marker-unknown">
            <Icon
              accessibility="unknown"
              category={{ _id: 'other' }}
              isMainCategory
              size="big"
              withArrow
              shadowed
              centered
            />
            <header>{accessibilityName('unknown')}</header>
            <footer>{unknownAccessibilityIncentiveText}</footer>
          </li>
        </ul>
      </section>

      <footer>
        <button className="button-cta-close focus-visible" onClick={onClose}>
          {startButtonCaption}
          <ChevronRight />
        </button>
      </footer>
    </ModalDialog>
  );
}

const StyledOnboarding = styled(Onboarding)`
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  @keyframes appear {
    0% {
      transform: scale3d(1.2, 1.2, 1);
      opacity: 0;
    }

    100% {
      transform: scale3d(1, 1, 1);
      opacity: 1;
    }
  }

  @keyframes highlight {
    0% {
      transform: scale3d(1, 1, 1);
      background-color: ${colors.linkColor};
    }

    5% {
      transform: scale3d(1.05, 1.05, 1);
      background-color: ${colors.linkColorDarker};
    }

    10% {
      transform: scale3d(1, 1, 1);
      background-color: ${colors.linkColorDarker};
    }

    100% {
      transform: scale3d(1, 1, 1);
      background-color: ${colors.linkColor};
    }
  }

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
    max-width: 80%;
    padding: 15px;
    overflow: auto;
    border-radius: 20px;
    background-color: rgba(255, 255, 255, 0.92);
    box-shadow: 0 5px 30px rgba(0, 0, 0, 0.15), 0 2px 5px rgba(0, 0, 0, 0.3);
    animation: fadeIn 0.5s linear;
    width: 100%; // Fix IE 11. @TODO Safe to be moved to ModalDialog component?

    .logo {
      width: 250px;
      height: 53px; // IE 11 does not preserve aspect ratio correctly and needs a fixed height.
    }

    @media (max-width: 1199px) {
      flex-direction: column !important;

      > footer,
      > header {
        text-align: center;
        max-width: 500px;
        align-self: center;
      }
    }

    @media (min-width: 1200px) {
      justify-content: center;
      align-items: center;
      max-width: 1200px;

      > header,
      footer {
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
      @media (max-width: 414px) {
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
        overflow-x: hidden;
        overflow-wrap: break-word;

        @media (max-width: 414px) {
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

        &:not(:last-child) {
          margin-right: 5px;
        }

        figure {
          top: 0;
          left: 0;
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
          max-width: 100%;
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

      &.focus-visible {
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
