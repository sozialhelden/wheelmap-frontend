import React from 'react';
import { t } from 'ttag';
import styled from 'styled-components';

import Toolbar from '../Toolbar';
import Link from '../Link/Link';
import CloseButton from '../CloseButton';
import ChevronLeft from '../ChevronLeft';
import { SecondaryButton } from '../Button';
import MapPinWithPlusIcon from './MapPinWithPlusIcon';
import BellIcon from './BellIcon';

const EventToolbar = ({ className, event, onClose }) => {
  return (
    <Toolbar className={className}>
      <header>
        <Link to="events">
          <EventToolbarChevronLeft />
        </Link>
        <div>
          <h2>{event.name}</h2>
          <p>{new Date(event.startTime.$date).toDateString()}</p>
        </div>
        <EventToolbarCloseButton onClick={onClose} />
      </header>
      <div className="actions">
        <SecondaryButton>{`Share link`}</SecondaryButton>
      </div>
      <img className="event-image" src="/static/images/eventPlaceholder.png" alt="" />
      <div className="statistics">
        <div>
          <div className="statistics-count">
            <MapPinWithPlusIcon />
            <span>{event.statistics.mappedPlacesCount}</span>
          </div>
          <div className="statistics-description">{t`map places`}</div>
        </div>
        <div>
          <div className="statistics-count">
            <BellIcon />
            <span>{event.statistics.invitedParticipantCount}</span>
          </div>
          <div className="statistics-description">{t`people invited`}</div>
        </div>
      </div>
      <div className="event-description">{event.description}</div>
    </Toolbar>
  );
};

const EventToolbarChevronLeft = styled(ChevronLeft)`
  margin-left: 0px;
`;

const EventToolbarCloseButton = styled(CloseButton)`
  align-self: flex-start;
  margin-top: -11px;
  margin-right: -10px;
  z-index: 4;
`;

const StyledEventToolbar = styled(EventToolbar)`
  color: #22262d;
  line-height: 1.2;

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  h2 {
    font-size: 20px;
    font-weight: 700;
    margin: 0;
  }

  p {
    color: #676b72;
    font-size: 16px;
    font-weight: 400;
    margin: 0;
    line-height: 1.2;
  }

  .actions {
    display: flex;
    margin-bottom: 20px;
  }

  .event-image {
    width: calc(100% + 30px);
    margin: 0 -15px 20px;
  }

  .statistics {
    display: flex;
    justify-content: space-around;
    text-align: center;
    margin-bottom: 20px;

    svg {
      margin-right: 10px;
    }
  }

  .statistics-count {
    font-size: 27px;
    font-weight: 300;
    color: #37404d;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .statistics-description {
    font-size: 14px;
    color: #22262d;
  }

  .event-description {
    margin-bottom: 20px;
  }
`;

export default StyledEventToolbar;
