import React from 'react';
import { t } from 'ttag';
import styled from 'styled-components';

import ShareBar from '../ShareBar/ShareBar';

const EventShareBar = ({ className, event, buttonCaption }) => {
  const url = event ? `https://wheelmap.org/events/${event._id}` : 'https://wheelmap.org';
  let mailSubject = t`Wheelmap.org`;
  let mailBody = t`I found a place on Wheelmap: ${url}`;

  const mailToLink = `mailto:?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(
    mailBody
  )}`;

  return (
    <ShareBar
      className={className}
      url={url}
      shareButtonCaption={buttonCaption}
      pageDescription={event.description}
      sharedObjectTitle={event.name}
      mailToLink={mailToLink}
    />
  );
};

const StyledEventShareBar = styled(EventShareBar)`
  width: 100%;
`;

export default StyledEventShareBar;
