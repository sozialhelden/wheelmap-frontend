// @flow

import styled from 'styled-components';
import * as React from 'react';
import { ShareButtons } from 'react-share';
import { t } from '../../../lib/i18n';
import colors from '../../../lib/colors';
import IconButton from '../../../lib/IconButton';
import type { Feature } from '../../../lib/Feature';
import type { Category } from '../../../lib/Categories';

import ChevronLeft from './icons/ChevronLeft';
import FacebookIcon from './icons/Facebook';
import TwitterIcon from './icons/Twitter';
import TelegramIcon from './icons/Telegram';
import EmailIcon from './icons/Email';
import WhatsAppIcon from './icons/WhatsApp';

const {
  FacebookShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
} = ShareButtons;


type Props = {
  feature: Feature,
  featureId: string | number | null,
  category: ?Category,
  parentCategory: ?Category,
  onToggle: (() => void),
  className: string,
};

type State = {
  isExpanded: boolean;
}


class ExpandableShareButtons extends React.Component<Props, State> {
  props: Props;

  state = {
    isExpanded: false,
  };

  toggle(isExpanded) {
    this.setState({ isExpanded });
    if (this.props.onToggle) this.props.onToggle();
  }


  componentWillReceiveProps(newProps: Props) {
    if (newProps.featureId !== this.props.featureId) {
      this.toggle(false);
    }
  }

  render() {
    const { feature, featureId } = this.props;

    let pageDescription = null;
    const url = featureId ? `https://wheelmap.org/nodes/${featureId}` : 'https://wheelmap.org';

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
      pageDescription = description || t`Find out about this place’s accessibility.`;
      mailBody = t`${sharedObjectTitle}\n\nClick on this link to open it: ${url}`;
    }
    const mailToLink = `mailto:?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

    const expandButton = (<button className={'link-button expand-button full-width-button'} onClick={() => this.toggle(true)}>
      {shareButtonCaption}
    </button>);

    if (!this.state.isExpanded) return expandButton;

    return (<div className={this.props.className}>
      <button className={'link-button collapse-button'} onClick={() => this.toggle(false)}>
        <ChevronLeft />
      </button>

      <footer className={this.state.isExpanded ? 'is-visible' : ''}>
        <FacebookShareButton url={url} quote={pageDescription}>
          <IconButton hoverColor={'#3C5A99'} activeColor={'#3C5A99'} iconComponent={<FacebookIcon />} caption="Facebook" />
        </FacebookShareButton>

        <TwitterShareButton url={url} title={sharedObjectTitle} hashtags={['wheelmap', 'accessibility', 'a11y']}>
          <IconButton hoverColor={'#1DA1F2'} activeColor={'#1DA1F2'} iconComponent={<TwitterIcon />} caption="Twitter" />
        </TwitterShareButton>

        <TelegramShareButton url={url} title={sharedObjectTitle}>
          <IconButton hoverColor={'#7AA5DA'} activeColor={'#7AA5DA'} iconComponent={<TelegramIcon />} caption="Telegram" />
        </TelegramShareButton>

        <a href={mailToLink}>
          <IconButton hoverColor={'#57C4AA'} activeColor={'#57C4AA'} iconComponent={<EmailIcon />} caption="Email" />
        </a>

        <WhatsappShareButton url={url} title={sharedObjectTitle}>
          <IconButton hoverColor={'#25D366'} activeColor={'#25D366'} iconComponent={<WhatsAppIcon />} caption="Whatsapp" />
        </WhatsappShareButton>
      </footer>
    </div>);
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

  .SocialMediaShareButton, a {
    cursor: pointer !important;
    border-radius: 10px;
    &:focus {
      background-color: ${colors.linkBackgroundColorTransparent};
      outline: none;
      border: none;
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
