import styled from 'styled-components';
import React, { FunctionComponent, RefObject } from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
} from 'react-share';
import { t } from 'ttag';
import colors from '../../lib/colors';
import IconButton, { Circle, Caption } from '../IconButton';
import { ChromelessButton } from '../Button';
import { interpolateLab } from 'd3-interpolate';
import ChevronLeft from './icons/ChevronLeft';
import FacebookIcon from './icons/Facebook';
import TwitterIcon from './icons/Twitter';
import TelegramIcon from './icons/Telegram';
import EmailIcon from './icons/Email';
import WhatsAppIcon from './icons/WhatsApp';

type ShareBarContentProps = {
  url: string;
  sharedObjectTitle: string;
  mailToLink: string;
  pageDescription: string;
  isExpanded: boolean;
  onHide: () => void;
  className?: string;
};

const ShareBarContent = React.forwardRef(
  (
    {
      onHide,
      isExpanded,
      className,
      url,
      sharedObjectTitle,
      pageDescription,
      mailToLink,
    }: ShareBarContentProps,
    ref: { current: null | HTMLButtonElement }
  ) => {
    // translator: Screenreader description for the share menu collapse button
    const shareMenuCollapseButtonAriaLabel = t`Collapse share menu`;

    const linkOpeningViaLocationHrefProps = {};

    return (
      <div className={className}>
        <ChromelessButton
          ref={ref}
          className="collapse-button"
          onClick={() => onHide()}
          aria-expanded={isExpanded}
          aria-label={shareMenuCollapseButtonAriaLabel}
        >
          <ChevronLeft />
        </ChromelessButton>

        <footer className={isExpanded ? 'is-visible' : ''}>
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
);

const StyledIconButton = styled(IconButton).attrs({ hoverColor: null, activeColor: null })`
  ${Caption} {
    font-size: 80%;
    margin-top: 0.3em;
  }

  ${Circle} {
    background-color: ${colors.tonedDownSelectedColor};
  }

  &.active {
    font-weight: bold;

    ${Circle} {
      background-color: ${props => props.activeColor || colors.selectedColor};
    }
  }

  @media (hover), (-moz-touch-enabled: 0) {
    &:not(.active):hover ${Circle} {
      background-color: ${props =>
        props.hoverColor ||
        interpolateLab(props.activeColor || colors.selectedColor, colors.tonedDownSelectedColor)(
          0.5
        )};
    }
  }
  &:focus {
    outline: none;
    ${Circle} {
      background-color: ${colors.selectedColor};
    }
  }
`;

export default ShareBarContent;
