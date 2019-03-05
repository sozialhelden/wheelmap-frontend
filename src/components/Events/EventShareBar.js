import React from 'react';
import { t } from 'ttag';

import ShareBar from '../ShareBar/ShareBar';

const EventShareBar = ({ event, buttonCaption }) => {
  const url = 'something'; //window.location.href;
  let mailSubject = t`Wheelmap.org`;
  let mailBody = t`I found a place on Wheelmap: ${url}`;

  const mailToLink = `mailto:?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(
    mailBody
  )}`;

  return (
    <ShareBar
      url={url}
      shareButtonCaption={buttonCaption}
      pageDescription={event.description}
      sharedObjectTitle={event.name}
      mailToLink={mailToLink}
    />
  );
};

export default EventShareBar;
