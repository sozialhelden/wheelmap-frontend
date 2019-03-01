import React from 'react';
import { t } from 'ttag';
import styled from 'styled-components';

import Toolbar from '../Toolbar';
import Link from '../Link/Link';
import CloseLink from '../CloseLink';
import ChevronLeft from '../ChevronLeft';

const EventToolbar = ({ className, event, onClose }) => {
  return (
    <Toolbar className={className}>
      <header>
        <Link to="events">
          <ChevronLeft />
        </Link>
        <div>
          <h2>{event.name}</h2>
          <p>{new Date(event.startTime.$date).toDateString()}</p>
        </div>
        <CloseLink onClick={onClose}>X</CloseLink>
      </header>
      <div className="statistics">
        <div>
          <div>{event.statistics.mappedPlacesCount}</div>
          <div>{t`map places`}</div>
        </div>
        <div>
          <div>{event.statistics.invitedParticipantCount}</div>
          <div>{t`people invited`}</div>
        </div>
      </div>
    </Toolbar>
  );
};

const StyledEventToolbar = styled(EventToolbar)`
  header {
    display: flex;
    align-items: start;
    justify-content: space-between;
  }

  h2 {
    font-size: 18px;
    margin: 0;
  }

  p {
    color: #0009;
    font-size: 16px;
    font-weight: 400;
    margin: 0;
    line-height: 1.2;
  }

  .statistics {
    display: flex;
    justify-content: space-around;
    text-align: center;
  }
`;

export default StyledEventToolbar;
