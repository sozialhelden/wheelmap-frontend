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
<<<<<<< HEAD
<<<<<<< HEAD

  // translator: Email text used when sharing a mapping event via email.
<<<<<<< HEAD
<<<<<<< HEAD
  let mailBody = t`Help us out and join the ${productNameLocalized} mapping event ${eventName}. You can find more info here: ${url}`;
=======
  // translator: Email text used when sharing a mapping event via email.
  let mailBody = t`Hi,\n\nHelp us out and join the ‘${eventName}’ mapping event!\n\nFind more info here: ${url}`;
>>>>>>> 21ade92a (Improve mapping event share text)
=======

  // translator: Email text used when sharing a mapping event via email.
<<<<<<< HEAD
  let mailBody = t`Hi 👋\n\nHelp us out and join the mapping event ‘${eventName}’ on ${productNameLocalized}. You can find more info here:\n\n${url}\n\nSee you there!`;
>>>>>>> 4d628543 (Sync with transifex)
=======
  let mailBody = t`Hi 👋\n\nHelp us out and join the mapping event ‘${eventName}’ on ${productNameLocalized}.You can find more info here:\n\n${url}\n\nSee you there!`;
>>>>>>> 1ae5835f (Sync translations to JS)
=======
  let mailBody = t`Hi 👋\n\nHelp us out and join the mapping event ‘${eventName}’ on ${productNameLocalized}. You can find more info here:\n\n${url}\n\nSee you there!`;
>>>>>>> 410d33dc (Improve mapping event share text)
=======
  let mailBody = t`Hi 👋\n\nHelp us out and join the mapping event ‘${eventName}’ on ${productNameLocalized}. You can find more info here:\n\n${url}\n\nSee you there!`;
=======
  let mailBody = t`Help us out and join the ${productNameLocalized} mapping event ${eventName}. You can find more info here: ${url}`;
>>>>>>> a1e39f19 (Sync with transifex)
>>>>>>> e5d2a64d (Sync with transifex)

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
