import React from 'react';
import { t } from 'ttag';
import styled from 'styled-components';

import Toolbar from '../Toolbar';
import EventShareBar from './EventShareBar';
import Link from '../Link/Link';
import CloseButton from '../CloseButton';
import ChevronLeft from '../ChevronLeft';
import MapPinWithPlusIcon from './MapPinWithPlusIcon';
import BellIcon from './BellIcon';
import { AppContextConsumer } from '../../AppContext';

const EventToolbar = ({ className, event, onClose, productName }) => {
  const date = new Date(event.startTime.$date);

  return (
    <Toolbar className={className}>
      <EventToolbarCloseButton onClick={onClose} />
      <header>
        <Link to="events">
          <EventToolbarChevronLeft />
        </Link>
        <div>
          <h2>{event.name}</h2>
          <p>{`${date.toLocaleDateString()} ${date.toLocaleTimeString()}`}</p>
        </div>
      </header>
      <img
        className="event-image"
        src={event.photoUrl ? event.photoUrl : '/static/images/eventPlaceholder.png'}
        alt=""
      />
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
      <div className="actions">
        <AppContextConsumer>
          {appContext => (
            <EventShareBar
              event={event}
              buttonCaption={t`Share link`}
              baseUrl={appContext.baseUrl}
              productName={productName}
            />
          )}
        </AppContextConsumer>
      </div>
      <div className="event-description">{event.description}</div>
    </Toolbar>
  );
};

const EventToolbarChevronLeft = styled(ChevronLeft)`
  margin-left: 0;
  padding: 15px 30px 15px 0;
  z-index: 4;
`;

const EventToolbarCloseButton = styled(CloseButton)`
  position: sticky;
  top: 0px;
  float: right;
  margin-right: -10px;
  z-index: 4;
`;

const StyledEventToolbar = styled(EventToolbar)`
  padding-top: 0;
  color: #22262d;
  line-height: 1.2;

  header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-top: 10px;
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

  .link-button {
    display: flex;
    align-items: center;
  }

  .link-button:not(:hover) {
    color: #494e53;
  }

  .link-button svg {
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 1rem;
    fill: #89939e;
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
