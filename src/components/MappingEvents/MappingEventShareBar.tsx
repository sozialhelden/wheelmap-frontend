import React from 'react';
import { t } from 'ttag';
import ShareBar from '../ShareBar/ShareBar';
import { MappingEvent } from '../../lib/MappingEvent';

type MappingEventShareBarProps = {
  className?: string,
  mappingEvent: MappingEvent,
  buttonCaption: string,
  baseUrl: string,
  productName: string | null,
};

const MappingEventShareBar = ({
  className,
  mappingEvent,
  buttonCaption,
  baseUrl,
  productName,
}: MappingEventShareBarProps) => {
  const url = mappingEvent ? `${baseUrl}/events/${mappingEvent._id}` : baseUrl;

  const sharedObjectTitle = productName
    ? `${mappingEvent.name} - ${productName}`
    : mappingEvent.name;

  const description = mappingEvent.description || mappingEvent.name;

  const mailSubject = sharedObjectTitle;
  const productNameString = productName ? ` on ${productName}` : '';
  // translator: Email text used when sharing a mapping event via email.
  let mailBody = t`Help us out and join the ${
    mappingEvent.name
  } mapping event${productNameString}. You can find more info here: ${url}`;

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
