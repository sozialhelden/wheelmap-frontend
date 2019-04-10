import React from 'react';
import { t } from 'ttag';
import styled from 'styled-components';

import ShareBar from '../ShareBar/ShareBar';

const MappingEventShareBar = ({ className, mappingEvent, buttonCaption, baseUrl, productName }) => {
  const url = mappingEvent ? `${baseUrl}/events/${mappingEvent._id}` : baseUrl;

  const sharedObjectTitle = productName
    ? `${mappingEvent.name} - ${productName}`
    : mappingEvent.name;

  const description = mappingEvent.description || mappingEvent.name;

  const mailSubject = sharedObjectTitle;
  // translator: Email text used when sharing a mapping event via email.
  let mailBody = t`Help us out and join the ${
    mappingEvent.name
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
      featureId={mappingEvent._id}
      mailToLink={mailToLink}
    />
  );
};

const StyledEventShareBar = styled(MappingEventShareBar)`
  ${ShareBar};
`;

export default StyledEventShareBar;
