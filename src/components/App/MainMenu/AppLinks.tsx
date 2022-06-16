import Link from 'next/link';
import React from 'react';
import { useCurrentMappingEvent } from './useCurrentMappingEvent';
import styled from 'styled-components';
import { useUniqueSurveyId } from './useUniqueSurveyId';
import colors from '../../../lib/colors';
import { useCurrentApp } from '../../../lib/data-fetching/useCurrentApp';
import { translatedStringFromObject } from '../../../lib/i18n';
import { insertPlaceholdersToAddPlaceUrl } from '../../../lib/model/insertPlaceholdersToAddPlaceUrl';

const Badge = styled.span`
  background-color: ${colors.warningColor};
  border-radius: 0.5rlh;
  padding: 0.2rem 0.3rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  color: white;
  margin: 0.1rem;
`;

function JoinedEventLink(props: { label: string | null; url: string | null }) {
  const joinedMappingEvent = useCurrentMappingEvent();

  if (joinedMappingEvent) {
    return (
      <Link href={`events/${joinedMappingEvent._id}`}>
        <a role="menuitem">{joinedMappingEvent.name}</a>
      </Link>
    );
  } else {
    return (
      <Link href="/events">
        <a role="menuitem">{props.label}</a>
      </Link>
    );
  }
}

export default function AppLinks(props: {}) {
  const joinedMappingEvent = useCurrentMappingEvent();
  const app = useCurrentApp();
  const baseUrl = `https://${app._id}/`;
  const uniqueSurveyId = useUniqueSurveyId();

  const {
    related: { appLinks },
  } = app;

  const links = Object.values(appLinks)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map(link => {
      const url =
        link.url &&
        insertPlaceholdersToAddPlaceUrl(
          baseUrl,
          translatedStringFromObject(link.url),
          joinedMappingEvent,
          uniqueSurveyId
        );
      const label = translatedStringFromObject(link.label);
      const badgeLabel = translatedStringFromObject(link.badgeLabel);
      const classNamesFromTags = link.tags && link.tags.map(tag => `${tag}-link`);
      const className = ['nav-link'].concat(classNamesFromTags).join(' ');

      const isAddPlaceLink = link.tags && link.tags.indexOf('add-place') !== -1;
      const isAddPlaceLinkWithoutCustomUrl = isAddPlaceLink && (!url || url == '/add-place');

      if (isAddPlaceLinkWithoutCustomUrl) {
        return (
          <Link key="add-place" href="/add-place">
            <a className={className} role="menuitem">
              {label}
              {badgeLabel && <Badge>{badgeLabel}</Badge>}
            </a>
          </Link>
        );
      }

      const isEventsLink = link.tags && link.tags.indexOf('events') !== -1;
      if (isEventsLink) {
        return <JoinedEventLink {...{ label, url }} />;
      }

      if (typeof url === 'string') {
        return (
          <Link key={url} href={url}>
            <a className={className} role="menuitem">
              {label}
              {badgeLabel && <Badge>{badgeLabel}</Badge>}
            </a>
          </Link>
        );
      }

      return null;
    });

  return <>{links}</>;
}
