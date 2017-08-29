// @flow
import React from 'react';
import { ShareButtons } from 'react-share';
import type { Feature } from '../../lib/Feature';
import Categories from '../../lib/Categories';
import type { Category } from '../../lib/Categories';

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
  className: string,
};


export default function NodeFooter(props: Props) {
  const { feature, featureId } = props;

  let pageTitle = 'Wheelmap.org';
  let pageDescription = null;
  const url = featureId ? `https://wheelmap.org/nodes/${featureId}` : 'https://wheelmap.org';
  let mailBody = `I found a place on Wheelmap: ${url}`;
  let mailToLink = `mailto:?subject=Wheelmap.org&body=${encodeURIComponent(mailBody)}`;
  if (feature && feature.properties) {
    const properties = feature.properties;
    const description: ?string = properties.wheelchair_description;
    const categoryOrParentCategory = props.category || props.parentCategory;
    const categoryName = categoryOrParentCategory ? categoryOrParentCategory._id : null;
    const placeName = properties.name || (categoryName && `${categoryName} on Wheelmap`) || 'This place is on Wheelmap';
    pageTitle = `I found this place on Wheelmap: ${placeName}`;
    pageDescription = description || 'Find out about this place\'s accessibility.';
    mailBody = `${pageTitle}\n\nClick on this link to open it: ${url}`;
    mailToLink = `mailto:?subject=${encodeURIComponent(placeName)}%20on%20Wheelmap.org&body=${encodeURIComponent(mailBody)}`;
  }

  return (<div className={props.className}>
    <FacebookShareButton className="link-button" url={url} description={pageDescription}>
    Share on Facebook
    </FacebookShareButton>
    <TwitterShareButton className="link-button" url={url} title={pageTitle} hashtags={['wheelmap','accessibility','a11y']}>
    Share on Twitter
    </TwitterShareButton>
    <TelegramShareButton className="link-button" url={url} title={pageTitle}>
    Share via Telegram
    </TelegramShareButton>
    <WhatsappShareButton className="link-button" url={url} title={pageTitle}>
    Share via Whatsapp
    </WhatsappShareButton>
    <a href={mailToLink} className="link-button">
    Share via Mail
    </a>
  </div>);
}
