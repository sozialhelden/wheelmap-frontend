import React from 'react';
import { t } from 'ttag';
import ShareBar from '../ShareBar/ShareBar';
import { MappingEvent } from '../../lib/MappingEvent';
import { translatedStringFromObject } from '../../lib/i18n';

type MappingEventShareBarProps = {
  className?: string;
  mappingEvent: MappingEvent;
  buttonCaption: string;
  baseUrl: string;
  productName: string | null;
};

const MappingEventShareBar = ({
  className,
  mappingEvent,
  buttonCaption,
  baseUrl,
  productName,
}: MappingEventShareBarProps) => {
  const url = mappingEvent ? `${baseUrl}/events/${mappingEvent._id}` : baseUrl;

  const eventName = mappingEvent.name && translatedStringFromObject(mappingEvent.name);
  const productNameLocalized = productName && translatedStringFromObject(productName);
  const sharedObjectTitle = productNameLocalized
    ? `${eventName} - ${productNameLocalized}`
    : eventName;

  const description = mappingEvent.description || productNameLocalized;

  const mailSubject = sharedObjectTitle;

  // translator: Email text used when sharing a mapping event via email.
  let mailBody = t`Help us out and join the ${productNameLocalized} mapping event ${eventName}. You can find more info here: ${url}`;

  const mailToLink = `mailto:?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(
    mailBody
  )}`;

  return (
    <ShareBar
      className={className}
      url={url}
      shareButtonCaption={buttonCaption}
      pageDescription={description}
      sharedObjectTitle={sharedObjectTitle}
      featureId={mappingEvent._id}
      mailToLink={mailToLink}
    />
  );
};

export default MappingEventShareBar;
