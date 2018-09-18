// @flow

import styled from 'styled-components';
import * as React from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
} from 'react-share';
import { t } from 'ttag';
import colors from '../../../lib/colors';
import IconButton from '../../IconButton';
import { interpolateLab } from 'd3-interpolate';

import type { Feature } from '../../../lib/Feature';
import type { Category } from '../../../lib/Categories';

import ChevronLeft from './icons/ChevronLeft';
import FacebookIcon from './icons/Facebook';
import TwitterIcon from './icons/Twitter';
import TelegramIcon from './icons/Telegram';
import EmailIcon from './icons/Email';
import WhatsAppIcon from './icons/WhatsApp';

import ShareIcon from '../../icons/actions/ShareIOS';

type Props = {
  feature: Feature,
  featureId: string | number | null,
  category: ?Category,
  parentCategory: ?Category,
  onToggle: () => void,
  className: string,
};

type State = {
  isExpanded: boolean,
};

const StyledIconButton = styled(IconButton)`
  .caption {
    font-size: 80%;
    margin-top: 0.3em;
  }
  .circle {
    background-color: ${colors.tonedDownSelectedColor};
  }
  &.active {
    font-weight: bold;
    .circle {
      background-color: ${props => props.activeColor || colors.selectedColor};
    }
  }
  @media (hover), (-moz-touch-enabled: 0) {
    &:not(.active):hover .circle {
      background-color: ${props =>
        props.hoverColor ||
        interpolateLab(props.activeColor || colors.selectedColor, colors.tonedDownSelectedColor)(
          0.5
        )};
    }
  }
  &:focus {
    outline: none;
    .circle {
      background-color: ${colors.selectedColor};
    }
  }
`;

class ExpandableShareButtons extends React.Component<Props, State> {
  props: Props;

  state = {
    isExpanded: false,
  };

  toggle(isExpanded) {
    const hasChanged = isExpanded !== this.state.isExpanded;
    if (!hasChanged) return;
    this.setState({ isExpanded });
    if (this.props.onToggle) this.props.onToggle();
  }

  componentWillReceiveProps(newProps: Props) {
    if (newProps.featureId !== this.props.featureId) {
      this.toggle(false);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    this.manageFocus(prevProps, prevState);
  }

  manageFocus(_, prevState) {
    if (this.state.isExpanded && !prevState.isExpanded) {
      this.collapseButton.focus();
    }

    if (prevState.isExpanded && !this.state.isExpanded) {
      this.shareButton.focus();
    }
  }

  focus() {
    this.shareButton.focus();
  }

  render() {
    const { feature, featureId } = this.props;

    let pageDescription = null;
    const url = featureId ? `https://wheelmap.org/beta/nodes/${featureId}` : 'https://wheelmap.org';

    // translator: Email body used when sharing a place without known name/category via email.
    let mailBody = t`I found a place on Wheelmap: ${url}`;
    // translator: Email body used when sharing a place without known name/category via email.// Email subject used for sharing a place via email.
    let mailSubject = t`Wheelmap.org`;
    // translator: First line in an email and shared object title used when sharing a place via email or a social network.
    let sharedObjectTitle = t`I found a place on Wheelmap…`;
    // Shown as button caption in the place toolbar
    const shareButtonCaption = t`Share`;

    if (feature && feature.properties) {
      const properties = feature.properties;
      const description: ?string = properties.wheelchair_description;
      const categoryOrParentCategory = this.props.category || this.props.parentCategory;
      const categoryName = categoryOrParentCategory ? categoryOrParentCategory._id : null;
      // translator: Used to describe a place with unknown name, but known category (when sharing)
      const placeName = properties.name || (categoryName && t`${categoryName} on Wheelmap`);
      if (placeName) {
        // translator: First line in an email and shared object title used when sharing a place via email or a social network.
        sharedObjectTitle = t`I found this place on Wheelmap: ${placeName}`;
        // translator: Email body used when sharing a place with known name via email.// Email subject used for sharing a place via email.
        mailSubject = t`${placeName} on Wheelmap.org`;
      }
      // translator: Additional description text for sharing a place in a social network.
      pageDescription = description || t`Learn more about the accessibility of this place`;
      mailBody = t`${sharedObjectTitle}\n\nClick on this link to open it: ${url}`;
    }
    const mailToLink = `mailto:?subject=${encodeURIComponent(
      mailSubject
    )}&body=${encodeURIComponent(mailBody)}`;

    const expandButton = (
      <button
        ref={shareButton => (this.shareButton = shareButton)}
        className={'link-button expand-button full-width-button'}
        aria-label={t`Expand share menu`}
        aria-expanded={this.state.isExpanded}
        onClick={() => this.toggle(true)}
      >
        <ShareIcon />
        <span>{shareButtonCaption}</span>
      </button>
    );

    if (!this.state.isExpanded) return expandButton;

    // The share button lib we're using is using window.open() by default which
    // seems to not work in our Cordova app for some reason. If we are a Cordova
    // app then we configure the share buttons to use window.location.href which
    // works in Cordova.
    // If we are on web we just use the default behavior of the share buttons.
    const linkOpeningViaLocationHrefProps = window.cordova
      ? { openWindow: false, onClick: link => (window.location.href = link) }
      : {};

    return (
      <div className={this.props.className}>
        <button
          ref={collapseButton => (this.collapseButton = collapseButton)}
          className={'link-button collapse-button'}
          onClick={() => this.toggle(false)}
          aria-expanded={this.state.isExpanded}
          aria-label={t`Collapse share menu`}
        >
          <ChevronLeft />
        </button>

        <footer className={this.state.isExpanded ? 'is-visible' : ''}>
          <FacebookShareButton
            url={url}
            quote={pageDescription}
            {...linkOpeningViaLocationHrefProps}
          >
            <StyledIconButton
              isHorizontal={false}
              hasCircle
              hoverColor={'#3C5A99'}
              activeColor={'#3C5A99'}
              caption="Facebook"
              ariaLabel="Facebook"
            >
              <FacebookIcon />
            </StyledIconButton>
          </FacebookShareButton>

          <TwitterShareButton
            url={url}
            title={sharedObjectTitle}
            hashtags={['wheelmap', 'accessibility', 'a11y']}
            {...linkOpeningViaLocationHrefProps}
          >
            <StyledIconButton
              isHorizontal={false}
              hasCircle
              hoverColor={'#1DA1F2'}
              activeColor={'#1DA1F2'}
              caption="Twitter"
              ariaLabel="Twitter"
            >
              <TwitterIcon />
            </StyledIconButton>
          </TwitterShareButton>

          <TelegramShareButton
            url={url}
            title={sharedObjectTitle}
            {...linkOpeningViaLocationHrefProps}
          >
            <StyledIconButton
              isHorizontal={false}
              hasCircle
              hoverColor={'#7AA5DA'}
              activeColor={'#7AA5DA'}
              caption="Telegram"
              ariaLabel="Telegram"
            >
              <TelegramIcon />
            </StyledIconButton>
          </TelegramShareButton>

          <a href={mailToLink}>
            <StyledIconButton
              isHorizontal={false}
              hasCircle
              hoverColor={'#57C4AA'}
              activeColor={'#57C4AA'}
              caption="Email"
              ariaLabel="Email"
            >
              <EmailIcon />
            </StyledIconButton>
          </a>

          <WhatsappShareButton
            url={url}
            title={sharedObjectTitle}
            {...linkOpeningViaLocationHrefProps}
          >
            <StyledIconButton
              isHorizontal={false}
              hasCircle
              hoverColor={'#25D366'}
              activeColor={'#25D366'}
              caption="Whatsapp"
              ariaLabel="Whatsapp"
            >
              <WhatsAppIcon />
            </StyledIconButton>
          </WhatsappShareButton>
        </footer>
      </div>
    );
  }
}

const StyledExpandableShareButtons = styled(ExpandableShareButtons)`
  margin: 0 -10px;
  padding: 0 5px 0 0;
  display: flex;
  flex-direction: row;

  header {
    min-height: 38px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  button.collapse-button {
    width: 25px;
    padding: 0;
    margin: 0;
    text-align: center;
  }

  footer {
    flex: 1;
    overflow: hidden;
    max-height: 0;
    opacity: 0;
    transition: opacity 1s ease-out, max-height 0.15s ease-out;

    &.is-visible {
      max-height: 100px;
      opacity: 1;
    }
  }

  footer {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
  }

  .SocialMediaShareButton,
  a {
    cursor: pointer !important;
    border-radius: 10px;
    &:focus {
      background-color: ${colors.linkBackgroundColorTransparent};
      outline: none;
      border: none;
    }

    svg {
      width: 21px;
      height: 21px;
      opacity: 0.95;
      g {
        fill: white;
      }
    }

    @media (hover), (-moz-touch-enabled: 0) {
      &:hover {
        .caption {
          color: ${colors.linkColor} !important;
        }
      }
    }
  }
`;

export default StyledExpandableShareButtons;
