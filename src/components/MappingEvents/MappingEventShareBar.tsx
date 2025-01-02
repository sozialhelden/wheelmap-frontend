import React from "react";
import { t } from "ttag";
import { useAppContext } from "../../lib/context/AppContext";
import useHostnameContext from "../../lib/context/HostnameContext";
import { translatedStringFromObject } from "../../lib/i18n/translatedStringFromObject";
import type { MappingEvent } from "../../lib/model/ac/MappingEvent";
import ShareBar from "../ShareBar/ShareBar";

type MappingEventShareBarProps = {
  className?: string;
  mappingEvent: MappingEvent;
  buttonCaption: string;
};

function MappingEventShareBar({
  className,
  mappingEvent,
  buttonCaption,
}: MappingEventShareBarProps) {
  const app = useAppContext();
  const productName = app.clientSideConfiguration.textContent.product.name;
  const productNameLocalized = translatedStringFromObject(productName);
  const hostName = useHostnameContext();
  const baseUrl = `https://${hostName}`;
  const url = mappingEvent ? `${baseUrl}/events/${mappingEvent._id}` : baseUrl;

  const eventName =
    mappingEvent.name && translatedStringFromObject(mappingEvent.name);
  const sharedObjectTitle = productNameLocalized
    ? `${eventName} - ${productNameLocalized}`
    : eventName;

  const description = mappingEvent.description || productNameLocalized;

  const mailSubject = sharedObjectTitle;
  // translator: Email text used when sharing a mapping event via email.
  const mailBody = t`Hi 👋\n\nHelp us out and join the mapping event ‘${eventName}’ on ${productNameLocalized}. You can find more info here:\n\n${url}\n\nSee you there!`;

  const mailToLink = `mailto:?subject=${encodeURIComponent(
    mailSubject,
  )}&body=${encodeURIComponent(mailBody)}`;

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
}

export default MappingEventShareBar;
