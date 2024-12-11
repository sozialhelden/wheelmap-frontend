import React from 'react'
import styled from 'styled-components'
import { useCurrentApp } from '../../../lib/context/AppContext'
import { useCurrentMappingEvent } from '../../../lib/context/useCurrentMappingEvent'
import { useUniqueSurveyId } from '../../../lib/context/useUniqueSurveyId'
import { translatedStringFromObject } from '../../../lib/i18n/translatedStringFromObject'
import { insertPlaceholdersToAddPlaceUrl } from '../../../lib/model/ac/insertPlaceholdersToAddPlaceUrl'
import Spinner from '../../ActivityIndicator/Spinner'
import SessionMenuItem from './SessionMenuItem'
import type { ButtonProps } from '@radix-ui/themes'
import AppLink from './AppLink'
import { useExpertMode } from './useExpertMode'
import type { IApp } from '../../../lib/model/ac/App'
import type { MappingEvent } from '../../../lib/model/ac/MappingEvent'

const Badge = styled.span`
  border-radius: 0.5rlh;
  padding: 0.2rem 0.3rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  margin: 0.1rem;
`

function JoinedEventLink(props: { label?: string; url?: string }) {
  const { data: joinedMappingEvent, isValidating } = useCurrentMappingEvent()

  if (isValidating) {
    return <Spinner />
  }

  const href = joinedMappingEvent
    ? `/events/${joinedMappingEvent._id}`
    : '/events'

  const label = joinedMappingEvent ? joinedMappingEvent.name : props.label

  return (
    <AppLink href={href} role="menuitem" className="nav-link">
      {label}
    </AppLink>
  )
}

function expandLinkMetadata(link: IApp['related']['appLinks'][string], app: IApp, joinedMappingEvent?: MappingEvent, uniqueSurveyId: string) {
  const baseUrl = `https://${app._id}/`
  const localizedUrl = translatedStringFromObject(link.url);
  const url = link.url
    && insertPlaceholdersToAddPlaceUrl(
      baseUrl,
      localizedUrl,
      joinedMappingEvent,
      uniqueSurveyId,
    )
  const label = translatedStringFromObject(link.label)
  const badgeLabel = translatedStringFromObject(link.badgeLabel)
  const isExternal = localizedUrl?.startsWith('http')
  return {
    ...link,
    url,
    label,
    badgeLabel,
    isExternal,
  }
}

export default function AppLinks() {
  const { data: joinedMappingEvent } = useCurrentMappingEvent()
  const app = useCurrentApp()
  const uniqueSurveyId = useUniqueSurveyId()
  const {
    related: { appLinks } = {},
  } = app

  const { isExpertMode } = useExpertMode()

  const links = React.useMemo(
    () => Object.values(appLinks ?? {})
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((link) => expandLinkMetadata(link, app, joinedMappingEvent, uniqueSurveyId))
      .map(({ tags, label, badgeLabel, url }) => {
        const isEventsLink = tags?.includes('events')
        if (isEventsLink) {
          return <JoinedEventLink {...{ label, url }} key="joined-event" />
        }

        const isSessionLink = tags?.includes('session')
        if (isSessionLink) {
          return (
            isExpertMode && <SessionMenuItem {...{ label }} key="session" />
          )
        }

        if (typeof url === 'string') {
          const buttonProps: ButtonProps = {
            variant: tags?.includes('primary') ? 'solid' : 'soft',
            highContrast: true,
          };
          return (
            <AppLink key={url} href={url} role="menuitem" buttonProps={buttonProps}>
              {label}
              {badgeLabel && <Badge>{badgeLabel}</Badge>}
            </AppLink>
          )
        }

        return null
      }), [app, appLinks, isExpertMode, joinedMappingEvent, uniqueSurveyId]);

  return <>{links}</>
}
