import React from 'react';
import { t } from 'ttag';
import styled from 'styled-components';

import Toolbar from '../Toolbar';
import Link from '../Link/Link';
import CloseLink from '../CloseLink';

const EventsToolbar = ({ className, events, onClose, onEventLinkClick }) => (
  <Toolbar className={className}>
    <header>
      <div className="number-badge">{events.length}</div>
      <div>
        <h2>{t`Events`}</h2>
        <p>{t`Meet the community and map the accessibility of places around you`}</p>
      </div>
      <CloseLink onClick={onClose}>X</CloseLink>
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
  header {
    display: flex;
    align-items: start;
  }
  h2 {
    font-size: 18px;
    margin: 0;
  }

  h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 400;
    color: #000c;
  }

  p {
    color: #0009;
    font-size: 16px;
    font-weight: 400;
    margin: 0;
    line-height: 1.2;
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
    text-align: left;
  }

  .number-badge {
    background-color: #2e6ce0;
    border-radius: 100%;
    color: #ffffff;
    font-weight: bold;
    text-align: center;
    width: 40px;
    height: 20px;
    margin-right: 10px;
  }
`;

export default StyledEventsToolbar;
