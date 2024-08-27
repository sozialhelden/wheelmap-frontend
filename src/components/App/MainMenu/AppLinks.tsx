import { useHotkeys } from '@blueprintjs/core'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import styled from 'styled-components'
import { useCurrentApp } from '../../../lib/context/AppContext'
import { useCurrentMappingEvent } from '../../../lib/context/useCurrentMappingEvent'
import { useUniqueSurveyId } from '../../../lib/context/useUniqueSurveyId'
import { translatedStringFromObject } from '../../../lib/i18n/translatedStringFromObject'
import { insertPlaceholdersToAddPlaceUrl } from '../../../lib/model/ac/insertPlaceholdersToAddPlaceUrl'
import colors from '../../../lib/util/colors'
import Spinner from '../../ActivityIndicator/Spinner'
import SessionLink from '../../Session/SessionLink'

const Badge = styled.span`
  background-color: ${colors.warningColor};
  border-radius: 0.5rlh;
  padding: 0.2rem 0.3rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  color: white;
  margin: 0.1rem;
`

function JoinedEventLink(props: { label: string | null; url: string | null }) {
  const { data: joinedMappingEvent, isValidating } = useCurrentMappingEvent()

  if (isValidating) {
    return <Spinner />
  }

  const href = joinedMappingEvent
    ? `/events/${joinedMappingEvent._id}`
    : '/events'

  const label = joinedMappingEvent ? joinedMappingEvent.name : props.label

  return (
    <Link href={href} role="menuitem" className="nav-link">
      {label}
    </Link>
  )
}

export default function AppLinks(props: {}) {
  const { data: joinedMappingEvent } = useCurrentMappingEvent()
  const app = useCurrentApp()
  const baseUrl = `https://${app._id}/`
  const uniqueSurveyId = useUniqueSurveyId()

  const {
    related: { appLinks },
  } = app

  const [toogle, setToogle] = useState(false)
  const hotkeys = useMemo(() => [
    {
      combo: 'l',
      global: true,
      label: 'Toogle OSM Power User Mode',
      onKeyDown: () => setToogle(!toogle),
    },

  ], [toogle])
  const { handleKeyDown, handleKeyUp } = useHotkeys(hotkeys)

  const links = Object.values(appLinks)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((link) => {
      const url = link.url
        && insertPlaceholdersToAddPlaceUrl(
          baseUrl,
          translatedStringFromObject(link.url),
          joinedMappingEvent,
          uniqueSurveyId,
        )
      const label = translatedStringFromObject(link.label)
      const badgeLabel = translatedStringFromObject(link.badgeLabel)
      const classNamesFromTags = link.tags && link.tags.map((tag) => `${tag}-link`)
      const className = ['nav-link'].concat(classNamesFromTags).join(' ')

      const isAddPlaceLink = link.tags && link.tags.indexOf('add-place') !== -1
      const isAddPlaceLinkWithoutCustomUrl = isAddPlaceLink && (!url || url == '/add-place')

      if (isAddPlaceLinkWithoutCustomUrl) {
        return (
          <Link
            key="add-place"
            href="/node/create"
            className={className}
            role="menuitem"
          >
            {label}
            {badgeLabel && <Badge>{badgeLabel}</Badge>}
          </Link>
        )
      }

      const isEventsLink = link.tags && link.tags.indexOf('events') !== -1
      if (isEventsLink) {
        return <JoinedEventLink {...{ label, url }} key="joined-event" />
      }

      const isSessionLink = link.tags && link.tags.indexOf('session') !== -1
      if (isSessionLink) {
        return (
          toogle && <SessionLink {...{ label }} key="session" className={className} onKeyDown={handleKeyDown} />
        )
      }

      if (typeof url === 'string') {
        return (
          <Link key={url} href={url} className={className} role="menuitem">
            {label}
            {badgeLabel && <Badge>{badgeLabel}</Badge>}
          </Link>
        )
      }

      return null
    })

  return <>{links}</>
}
