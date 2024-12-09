import intersperse from 'intersperse'
import { DateTime } from 'luxon'
import opening_hours from 'opening_hours'
import * as React from 'react'
import { t } from 'ttag'
import { useAdminAreas } from '../../../../lib/fetchers/osm-api/fetchAdminAreas'
import StyledMarkdown from '../../../shared/StyledMarkdown'
import FeatureContext from '../FeatureContext'
import { isOSMFeature, type TypeTaggedOSMFeature } from '../../../../lib/model/geo/AnyFeature'
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

export default function OpeningHoursValue(props: { value: string, tagKey: string, osmFeature?: TypeTaggedOSMFeature }) {
  // https://openingh.ypid.de/evaluation_tool/?lng=en
  // https://github.com/opening-hours/opening_hours.js
  const { value, osmFeature, tagKey } = props
  const feature = React.useContext(FeatureContext)

  let lat: number | undefined
  let lon: number | undefined
  let country: string | undefined
  let state: string | undefined
  if (isOSMFeature(feature)) {
    [lon, lat] = feature.geometry.coordinates
    country = feature.properties['addr:country'] ? String(feature.properties['addr:country']) : undefined
    state = feature.properties['addr:state'] ? String(feature.properties['addr:state']) : undefined
  }
  const adminAreas = useAdminAreas({ longitude: lon, latitude: lat })
  const { featuresByType } = adminAreas
  country = country || featuresByType?.country?.properties?.['ISO3166-1:alpha2']
  state = state || (featuresByType?.state || featuresByType?.city)?.properties?.state_code

  const { outputs, oh, niceString } = React.useMemo(() => {
    try {
      const oh = new opening_hours(
        value,
        {
          lat,
          lon,
          address: { country_code: country, state },
        },
        {
          locale: navigator.language.slice(0, 2),
          tag_key: tagKey,
          map_value: true,
        },
      )
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

    .replace(/\bJan\b/g, t`January`)
    .replace(/\bFeb\b/g, t`February`)
    .replace(/\bMar\b/g, t`March`)
    .replace(/\bApr\b/g, t`April`)
    .replace(/\bMay\b/g, t`May`)
    .replace(/\bJun\b/g, t`June`)
    .replace(/\bJul\b/g, t`July`)
    .replace(/\bAug\b/g, t`August`)
    .replace(/\bSep\b/g, t`September`)
    .replace(/\bOct\b/g, t`October`)
    .replace(/\bNov\b/g, t`November`)
    .replace(/\bDec\b/g, t`December`)

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

      &nbsp;

      {osmFeature?.properties['opening_hours:url']
        && (
          <a href={osmFeature.properties['opening_hours:url']}>
            {t`See website`}
            .
          </a>
        )}

      <div style={{ marginTop: '0.5rem', opacity: 0.8 }}>
        {shownElements}
      </div>
    </>
  )
}
