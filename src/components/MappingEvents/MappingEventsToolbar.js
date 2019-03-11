import React from 'react';
import { t } from 'ttag';
import styled from 'styled-components';

import Toolbar from '../Toolbar';
import Link from '../Link/Link';
import CloseButton from '../CloseButton';

const MappingEventsToolbar = ({ className, mappingEvents, onClose, onMappingEventLinkClick }) => (
  <Toolbar className={className}>
    <MappingEventsToolbarCloseButton onClick={onClose} />
    <header>
      <span className="number-badge">{mappingEvents.length}</span>
      <div className="header-title">
        <h2>{t`Events`}</h2>
        <p>{t`Meet the community and map the accessibility of places around you`}</p>
      </div>
    </header>
    <ul>
      {mappingEvents.map(event => (
        <li key={event._id}>
          <Link
            to={`mappingEventDetail`}
            params={{ id: event._id }}
            className="link-button"
            onClick={() => onMappingEventLinkClick(event._id)}
          >
            <h3>{event.name}</h3>
            <p>{event.regionName}</p>
          </Link>
        </li>
      ))}
    </ul>
  </Toolbar>
);

const MappingEventsToolbarCloseButton = styled(CloseButton)`
  position: sticky;
  top: 0px;
  float: right;
  margin-right: -10px;
  z-index: 4;
`;

const StyledMappingEventsToolbar = styled(MappingEventsToolbar)`
  padding-top: 0;
  color: #22262d;
  line-height: 1.2;

  header {
    display: flex;
    align-items: center;
    margin-top: 10px;
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

export default StyledMappingEventsToolbar;
