import intersperse from 'intersperse'
import { DateTime } from 'luxon'
import opening_hours from 'opening_hours'
import * as React from 'react'
import { t } from 'ttag'
import { useAdminAreas } from '../../../../lib/fetchers/osm-api/fetchAdminAreas'
import StyledMarkdown from '../../../shared/StyledMarkdown'
import FeatureContext from '../FeatureContext'
import { isOSMFeature } from '../../../../lib/model/geo/AnyFeature'
import { features } from 'process'
import { log } from '../../../../lib/util/logger'

// helper function
function getReadableState(oh: opening_hours) {
  const outputs: string[] = []
  const comment = oh.getComment()
  if (oh.getUnknown()) {
    const maybeOpen = t`Maybe open`
    const maybeOpenBut = t`Maybe open – ${comment}`
    outputs.push(comment ? maybeOpenBut : maybeOpen)
  } else {
    const state = oh.getState()
    outputs.push(state ? t`Now open.` : t`Now closed.`)
    if (comment) {
      outputs.push(t`(“${comment}”)`)
    }
  }
  return outputs
}

export default function OpeningHoursValue(props: { value: string }) {
  // https://openingh.ypid.de/evaluation_tool/?lng=en
  // https://github.com/opening-hours/opening_hours.js
  const { value } = props
  const feature = React.useContext(FeatureContext)

  let lat; let lon; let country; let
    state
  if (isOSMFeature(feature)) {
    lat = feature.geometry.coordinates[1]
    lon = feature.geometry.coordinates[0]
    country = feature.properties['addr:country']
    state = feature.properties['addr:state']
  }
  const adminAreas = useAdminAreas({ longitude: lon, latitude: lat })
  const { featuresByType } = adminAreas
  country = country || featuresByType?.country?.properties?.['ISO3166-1:alpha2']
  state = state || (featuresByType?.state || featuresByType?.city)?.properties?.state_code

  const { outputs, oh, niceString } = React.useMemo(() => {
    try {
      const oh = new opening_hours(value, { lat, lon, address: { country_code: country, state } }, { locale: navigator.language.slice(0, 2), tag_key: 'opening_hours', map_value: true })
      const isOpen = oh.getState() // for current date
      const nextChangeDate = oh.getNextChange()
      const outputs = getReadableState(oh)

      if (typeof nextChangeDate === 'undefined') outputs.push(t`(indefinitely)`)
      else {
        const isUnknown = oh.getUnknown(nextChangeDate)
        const nextChangeDateTime = DateTime.fromJSDate(nextChangeDate)
        const nextChangeDateFormatted = nextChangeDateTime.toRelative({ base: DateTime.now() })

        if (!isUnknown && !isOpen) {
          outputs.push(t`Will open ${nextChangeDateFormatted}.`)
        } else if (!isUnknown && isOpen) {
          outputs.push(t`Will close ${nextChangeDateFormatted}.`)
        } else if (isUnknown && !isOpen) {
          outputs.push(t`Might open ${nextChangeDateFormatted}.`)
        } else if (isUnknown && isOpen) {
          outputs.push(t`Might close ${nextChangeDateFormatted}.`)
        }
      }
      return { outputs, oh, niceString }
    } catch (e) {
      log.error(e)
      return { outputs: [] }
    }
  }, [lat, lon, country, state, value])

  const niceLines = oh?.prettifyValue()
  const shownValue = (niceString as string || value)
    .replace(/\bMo\b/g, t`Monday`)
    .replace(/\bTu\b/g, t`Tuesday`)
    .replace(/\bWe\b/g, t`Wednesday`)
    .replace(/\bTh\b/g, t`Thursday`)
    .replace(/\bFr\b/g, t`Friday`)
    .replace(/\bSa\b/g, t`Saturday`)
    .replace(/\bSu\b/g, t`Sunday`)
    .replace(/\bPH\b/g, t`public holiday`)
    .replace(/\boff\b/g, t`closed`)
    .replace(/\bSH\b/g, t`school holiday`)
    .replace(/,/g, ', ')
  const shownElements = intersperse(shownValue.split(/;|\|\|/), <br />)

  if (!outputs.length) {
    return <>{shownElements}</>
  }

  return (
    <>
      <strong>
        <StyledMarkdown inline element="span">
          {outputs[0]}
        </StyledMarkdown>
      </strong>

      {outputs.length > 1 && (
        <>
      &nbsp;
          <StyledMarkdown inline element="span">
            {outputs.slice(1).join(' ')}
          </StyledMarkdown>
        </>
      )}

      <div style={{ marginTop: '0.5rem', opacity: 0.8 }}>
        {shownElements}
      </div>
    </>
  )
}
