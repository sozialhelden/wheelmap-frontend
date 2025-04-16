import { parse } from 'marked';
import * as React from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';
import { t } from 'ttag';
import { ClientSideConfiguration } from '../../lib/ClientSideConfiguration';
import { accessibilityDescription, accessibilityName } from '../../lib/Feature';
import colors from '../../lib/colors';
import env from '../../lib/env';
import { translatedStringFromObject } from '../../lib/i18n';
import { CallToActionButton } from '../Button';
import CategoryIcon from '../Icon';
import ModalDialog from '../ModalDialog';
import VectorImage from '../VectorImage';
import ChevronRight from '../icons/actions/ChevronRight';

type Props = {
  className?: string,
  isVisible: boolean,
  onClose: () => void,
  clientSideConfiguration: ClientSideConfiguration,
};


const Onboarding: React.FC<Props> = ({className, isVisible, onClose, clientSideConfiguration}) => {
  const callToActionButton = React.createRef<HTMLButtonElement>();

  const { headerMarkdown } = clientSideConfiguration.textContent?.onboarding || {
          headerMarkdown: undefined,
        };

  const productName =
    translatedStringFromObject(clientSideConfiguration.textContent?.product.name) ||
    'Wheelmap';

  // translator: Shown on the onboarding screen. To find it, click the logo at the top.
  const unknownAccessibilityIncentiveText = t`Help out by marking places!`;

  // translator: Button caption shown on the onboarding screen. To find it, click the logo at the top.
  const startButtonCaption = t`Okay, let’s go!`;

  const handleClose = () => {
    // Prevent that touch up opens a link underneath the primary button after closing
    // the onboarding dialog
    setTimeout(() => onClose(), 10);
  };

  const headerMarkdownHTML = headerMarkdown && parse(translatedStringFromObject(headerMarkdown));

  return (
    <ModalDialog
      className={className}
      isVisible={isVisible}
      onClose={handleClose}
      ariaDescribedBy="wheelmap-claim-onboarding wheelmap-icon-descriptions"
      ariaLabel={t`Start screen`}
      focusTrapActiveFromStart={false}
    >
      <header>
        <VectorImage
          className="logo"
          svg={clientSideConfiguration.branding?.vectorLogoSVG}
          aria-label={productName}
          maxHeight={'50px'}
          maxWidth={'200px'}
          hasShadow={false}
        />

        {headerMarkdownHTML && (
          <p
            id="wheelmap-claim-onboarding"
            className="claim"
            dangerouslySetInnerHTML={{ __html: headerMarkdownHTML }}
          />
        )}
      </header>

      <section>
        <ul id="wheelmap-icon-descriptions">
          <li className="ac-marker-yes">
            <CategoryIcon
              accessibility="yes"
              category={null}
              isMainCategory
              size="big"
              withArrow
              shadowed
              centered
            />
            <header>{accessibilityName('yes', clientSideConfiguration)}</header>
            <footer>{accessibilityDescription('yes')}</footer>
          </li>
          <li className="ac-marker-limited">
            <CategoryIcon
              accessibility="limited"
              category={null}
              isMainCategory
              size="big"
              withArrow
              shadowed
              centered
            />
            <header>{accessibilityName('limited', clientSideConfiguration)}</header>
            <footer>{accessibilityDescription('limited')}</footer>
          </li>
          <li className="ac-marker-no">
            <CategoryIcon
              accessibility="no"
              category={null}
              isMainCategory
              size="big"
              withArrow
              shadowed
              centered
            />
            <header>{accessibilityName('no', clientSideConfiguration)}</header>
            <footer>{accessibilityDescription('no')}</footer>
          </li>
          <li className="ac-marker-unknown">
            <CategoryIcon
              accessibility="unknown"
              category={null}
              isMainCategory
              size="big"
              withArrow
              shadowed
              centered
            />
            <header>{accessibilityName('unknown', clientSideConfiguration)}</header>
            <footer>{unknownAccessibilityIncentiveText}</footer>
          </li>
        </ul>
      </section>

      <footer className="button-footer">
        <CallToActionButton
          className="button-continue"
          data-focus-visible-added
          onClick={() => {
            handleClose();
          }}
          ref={callToActionButton}
        >
          {startButtonCaption}
          <ChevronRight />
        </CallToActionButton>
      </footer>
      <Version>{env.npm_package_version}</Version>
    </ModalDialog>
  );
}

const Version = styled.div`
  position: absolute;
  right: 5px;
  bottom: 5px;
  margin-right: constant(safe-area-inset-right);
  margin-right: env(safe-area-inset-right);
  margin-bottom: constant(safe-area-inset-bottom);
  margin-bottom: env(safe-area-inset-bottom);
  font-size: 12px;
  color: white;
  opacity: 0.5;
`;

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

  @media (max-width: 320px) {
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
    flex-direction: column;
    max-width: 80%;
    max-width: 800px;
    padding: 15px;
    overflow: auto;
    border-radius: 20px;
    background-color: rgba(255, 255, 255, 0.96);
    box-shadow: 0 5px 30px rgba(0, 0, 0, 0.15), 0 2px 5px rgba(0, 0, 0, 0.3);
    animation: fadeIn 0.5s linear;
    width: 100%; /* Fix IE 11. @TODO Safe to be moved to ModalDialog component? */

    @media (max-height: 478px) {
      font-size: 0.8rem;
      #wheelmap-icon-descriptions {
        margin: 0;
      }
    }

    .logo {
      width: 250px;
      height: 53px; /* IE 11 does not preserve aspect ratio correctly and needs a fixed height. */

      @media (max-width: 414px) {
        width: 200px;
        height: 42px;
      }

      @media (max-height: 478px) {
        width: 150px;
        height: 32px;
      }

      object-fit: contain;
    }

    .claim {
      @media (min-width: 414px) {
        font-size: 1.25rem;
        margin-top: 1rem;
      }
      @media (min-height: 414px) {
        font-size: 1.25rem;
        margin-top: 1rem;
      }
    }

    > footer,
    > header,
    > section.main-section {
      text-align: center;
      max-width: 560px;
      align-self: center;
    }

    ul {
      display: flex;
      flex-direction: row;
      justify-content: center;

      list-style-type: none;

      @media (orientation: portrait) {
        align-items: start;
      }
      @media (orientation: landscape) {
        margin: 1rem 0;
      }

      /* @media (max-width: 768px) {
        margin: 0 !important;
      } */
      @media (max-width: 414px) {
        flex-direction: column !important;
      }
      @media (max-height: 414px) {
        flex-wrap: wrap;
      }

      li {
        /* flex: 1; */
        display: flex;
        flex-direction: column;

        justify-content: space-around;
        align-items: center;
        text-align: center;
        background-color: transparent;
        overflow-x: hidden;
        overflow-wrap: break-word;

        @media (max-width: 414px), (max-height: 414px) {
          height: 3em;
          flex-direction: row !important;
          text-align: left !important;
          /* padding: 0 10px !important; */

          figure {
            margin-right: 0.5rem;
            min-width: 30px;
            width: 30px;
            height: 30px;
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
          max-width: 10rem;
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

  .button-footer {
    display: flex;
    flex-direction: column;
    min-height: 80px;

    .button-continue-with-cookies {
      margin: 0.5em;
    }
  }

  .cookies-footer {
    opacity: 0.5;
  }

  p {
    margin: 1em;
  }
`;

export default StyledOnboarding;
