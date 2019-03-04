import React from 'react';
import { t } from 'ttag';
import styled from 'styled-components';

import Toolbar from '../Toolbar';
import Link from '../Link/Link';
import CloseButton from '../CloseButton';

const EventsToolbar = ({ className, events, onClose, onEventLinkClick }) => (
  <Toolbar className={className}>
    <header>
      <span className="number-badge">{events.length}</span>
      <div className="header-title">
        <h2>{t`Events`}</h2>
        <p>{t`Meet the community and map the accessibility of places around you`}</p>
      </div>
      <CloseButton onClick={onClose} />
    </header>
    <ul>
      {events.map(event => (
        <li key={event._id}>
          <Link
            to={`eventDetail`}
            params={{ id: event._id }}
            className="link-button"
            onClick={() => onEventLinkClick(event._id)}
          >
            <h3>{event.name}</h3>
            <p>{event.regionName}</p>
          </Link>
        </li>
      ))}
    </ul>
  </Toolbar>
);

const StyledEventsToolbar = styled(EventsToolbar)`
  color: #22262d;
  line-height: 1.2;

  header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  h2 {
    font-size: 20px;
    margin: 0;
  }

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: #22262d;
  }

  p {
    color: #676b72;
    font-size: 16px;
    font-weight: 400;
    line-height: 1.2;
    margin: 0;
  }

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  li {
    padding: 0;
  }

  .link-button {
    width: 100%;
  }

  .close-link {
    padding: 5px;
    align-self: flex-start;
  }

  .number-badge {
    background-color: #2e6ce0;
    border-radius: 100%;
    color: #ffffff;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    padding: 4px 0;
    margin-right: 10px;
    min-width: 30px;
    line-height: 22px;
  }
`;

export default StyledEventsToolbar;
