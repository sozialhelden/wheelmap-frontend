import React from 'react';
import { t } from 'ttag';
import styled from 'styled-components';
import env from '../../lib/env';

import ShareBar from '../ShareBar/ShareBar';

const EventShareBar = ({ className, event, buttonCaption, productName }) => {
  const baseUrl = env.public.baseUrl;
  const url = event ? `${baseUrl}/events/${event._id}` : baseUrl;

  const sharedObjectTitle = productName ? `${event.name} - ${productName}` : event.name;

  const description = event.description || event.name;

  const mailSubject = sharedObjectTitle;
  // translator: Email text used when sharing an event via email.
  let mailBody = t`Help us out and join the ${
    event.name
  } mapping event on ${productName}. You can find more info here: ${url}`;

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
      featureId={event._id}
      mailToLink={mailToLink}
    />
  );
};

const StyledEventShareBar = styled(EventShareBar)`
  width: 100%;
`;

export default StyledEventShareBar;
