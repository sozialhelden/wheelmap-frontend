// @flow

import styled from 'styled-components';
import React, { Component } from 'react';
import { ShareButtons } from 'react-share';
import IconButton from '../../../lib/IconButton';
import type { Feature } from '../../../lib/Feature';
import type { Category } from '../../../lib/Categories';
import colors from '../../../lib/colors';

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
};

type State = {
  isExpanded: boolean;
}


class ExpandableShareButtons extends Component<void, Props, State> {
  state = {
    isExpanded: false,
  };

  expand() {
    this.setState({ isExpanded: true });
  }

  collapse() {
    this.setState({ isExpanded: false });
  }

  componentWillReceiveProps(newProps: Props) {
    if (newProps.featureId !== this.props.featureId) {
      this.collapse();
    }
  }

  render() {
    const { feature, featureId } = this.props;

    let pageTitle = 'Wheelmap.org';
    let pageDescription = null;
    const url = featureId ? `https://wheelmap.org/nodes/${featureId}` : 'https://wheelmap.org';
    let mailBody = `I found a place on Wheelmap: ${url}`;
    let mailToLink = `mailto:?subject=Wheelmap.org&body=${encodeURIComponent(mailBody)}`;
    let placeName = 'a place';

    if (feature && feature.properties) {
      const properties = feature.properties;
      const description: ?string = properties.wheelchair_description;
      const categoryOrParentCategory = this.props.category || this.props.parentCategory;
      const categoryName = categoryOrParentCategory ? categoryOrParentCategory._id : null;
      placeName = properties.name || (categoryName && `${categoryName} on Wheelmap`) || 'This place is on Wheelmap';
      pageTitle = `I found this place on Wheelmap: ${placeName}`;
      pageDescription = description || 'Find out about this place\'s accessibility.';
      mailBody = `${pageTitle}\n\nClick on this link to open it: ${url}`;
      mailToLink = `mailto:?subject=${encodeURIComponent(placeName)}%20on%20Wheelmap.org&body=${encodeURIComponent(mailBody)}`;
    }

    const expandButton = (<button className={'link-button expand-button full-width-button'} onClick={() => this.expand()}>
      Share
    </button>);

    if (!this.state.isExpanded) return expandButton;

    return (<div className={this.props.className}>
      <button className={'link-button collapse-button'} onClick={() => this.collapse()}>
        <ChevronLeft />
      </button>

      <footer className={this.state.isExpanded ? 'is-visible' : ''}>
        <FacebookShareButton url={url} quote={pageDescription}>
          <IconButton hoverColor={'#3C5A99'} iconComponent={<FacebookIcon />} caption="Facebook" />
        </FacebookShareButton>

        <TwitterShareButton url={url} title={pageTitle} hashtags={['wheelmap', 'accessibility', 'a11y']}>
          <IconButton hoverColor={'#1DA1F2'} iconComponent={<TwitterIcon />} caption="Twitter" />
        </TwitterShareButton>

        <TelegramShareButton url={url} title={pageTitle}>
          <IconButton hoverColor={'#7AA5DA'} iconComponent={<TelegramIcon />} caption="Telegram" />
        </TelegramShareButton>

        <a href={mailToLink}>
          <IconButton hoverColor={'#57C4AA'} iconComponent={<EmailIcon />} caption="Email" />
        </a>

        <WhatsappShareButton url={url} title={pageTitle}>
          <IconButton hoverColor={'#25D366'} iconComponent={<WhatsAppIcon />} caption="Whatsapp" />
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

    &:hover {
      .caption {
        color: ${colors.linkColor} !important;
      }
    }
  }
`;

export default StyledExpandableShareButtons;
