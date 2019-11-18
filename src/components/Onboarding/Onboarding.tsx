import { t } from 'ttag';
import * as React from 'react';
import styled from 'styled-components';
import marked from 'marked';
import ModalDialog from '../ModalDialog';
import ChevronRight from '../icons/actions/ChevronRight';
import colors from '../../lib/colors';
import { accessibilityDescription, accessibilityName } from '../../lib/Feature';
import Icon from '../Icon';
import { translatedStringFromObject, LocalizedString } from '../../lib/i18n';
import { ChromelessButton, CallToActionButton } from '../Button';
import env from '../../lib/env';

type Props = {
  className?: string,
  isVisible: boolean,
  onClose: () => void,
  headerMarkdown: LocalizedString | string,
  logoURL: string,
  analyticsShown: boolean,
  analyticsAllowed: boolean,
  analyticsAllowedChanged: (value: boolean) => void,
};

class Onboarding extends React.Component<Props, null> {
  callToActionButton = React.createRef<HTMLButtonElement>();

  componentDidMount() {
    setTimeout(() => {
      if (this.callToActionButton.current instanceof HTMLButtonElement) {
        this.callToActionButton.current.focus();
      }
    }, 100);
  }

  render() {
    const { props } = this;
    const { logoURL, headerMarkdown, analyticsShown, analyticsAllowedChanged } = props;
    // translator: Shown on the onboarding screen. To find it, click the logo at the top.
    const unknownAccessibilityIncentiveText = t`Help out by marking places!`;
    // translator: Button caption shown on the onboarding screen. To find it, click the logo at the top.
    const startButtonCaption = t`Okay, let’s go!`;
    // translator: Button caption shown on the onboarding screen. To find it, click the logo at the top.
    const skipAnalyticsButtonCaption = t`Continue without cookies`;

    // translator: Cookie notice with link to privacy policy
    const cookieNotice = t`We use cookies to improve this app for you. <a href="https://news.wheelmap.org/terms-of-use/" target="_blank">Read our Privacy Policy</a>.`;

    const onClose = () => {
      // Prevent that touch up opens a link underneath the primary button after closing
      // the onboarding dialog
      setTimeout(() => props.onClose(), 10);
    };

    const headerMarkdownHTML = marked(translatedStringFromObject(headerMarkdown));

    /* translator: The alternative desription of the app logo for screenreaders */
    const appLogoAltText = t`App Logo`;

    return (
      <ModalDialog
        className={props.className}
        isVisible={props.isVisible}
        onClose={props.onClose}
        ariaDescribedBy="wheelmap-claim-onboarding wheelmap-icon-descriptions"
        ariaLabel={t`Start screen`}
      >
        <header>
          <img
            className="logo"
            src={logoURL}
            width={123}
            height={30}
            alt={appLogoAltText}
            aria-hidden={true}
          />

          <p
            id="wheelmap-claim-onboarding"
            className="claim"
            dangerouslySetInnerHTML={{ __html: headerMarkdownHTML }}
          />
        </header>

        <section>
          <ul id="wheelmap-icon-descriptions">
            <li className="ac-marker-yes">
              <Icon
                accessibility="yes"
                category={null}
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
                category={null}
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
                category={null}
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
                category={null}
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

        <footer className="button-footer">
          <CallToActionButton
            className="button-continue-with-cookies"
            data-focus-visible-added
            onClick={() => {
              analyticsAllowedChanged(true);
              onClose();
            }}
            ref={this.callToActionButton}
          >
            {startButtonCaption}
            <ChevronRight />
          </CallToActionButton>
          {analyticsShown && (
            <ChromelessButton
              className="button-continue-without-cookies"
              onClick={() => {
                analyticsAllowedChanged(false);
                onClose();
              }}
            >
              {skipAnalyticsButtonCaption}
            </ChromelessButton>
          )}
        </footer>

        {analyticsShown && (
          <footer className="cookies-footer">
            <p dangerouslySetInnerHTML={{ __html: cookieNotice }} />
          </footer>
        )}

        <Version>{env.npm_package_version}</Version>
      </ModalDialog>
    );
  }
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
      @media (min-width: 414px, min-height: 414px) {
        font-size: 1.25rem;
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
