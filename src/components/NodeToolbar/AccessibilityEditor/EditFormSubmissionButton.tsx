import * as React from 'react'
import styled from 'styled-components'
import { t } from 'ttag'
import { v4 as uuidv4 } from 'uuid'

import { PlaceInfo } from '@sozialhelden/a11yjson'
import type { SourceWithLicense } from '../../../../app/PlaceDetailsProps'
import AppContext from '../../../AppContext'
import { accessibilityCloudFeatureCache } from '../../../lib/cache/AccessibilityCloudFeatureCache'
import colors from '../../../lib/util/colors'
import Spinner from '../../ActivityIndicator/Spinner'
import { PrimaryButton } from '../../Button'

function hasKoboSubmission(feature: PlaceInfo | null) {
  if (!feature) {
    return false
  }

  const ids = feature.properties && feature.properties.ids
  if (ids instanceof Array && ids.length > 0) {
    for (const externalId of ids) {
      if (externalId.provider === 'koboSubmission') {
        return true
      }
    }
  }
  return false
}

type Props = {
  className?: string,
  featureId: string | number | null,
  feature: PlaceInfo | null,
  sources: SourceWithLicense[] | null,
};

type State = 'Idle' | 'CreatingLink' | 'Error';

const validLinkDuration = 1000 * 60 * 3 // 3 minutes

function openSurveyLink(url: string) {
  window.open(url, '_blank')
}

function EditFormSubmissionButton(props: Props) {
  const primarySource = props.sources && props.sources.length > 0 ? props.sources[0].source : undefined
  const [state, setState] = React.useState<State>('Idle')
  const [error, setError] = React.useState<string | null>(null)
  const resolvedEditUrl = React.useRef<string | null>(null)

  const appContext = React.useContext(AppContext)
  const { tokenString } = appContext.app
  const { baseUrl } = appContext
  const placeId = props.featureId

  const createOrOpenEditLink = React.useCallback(() => {
    if (!placeId || typeof placeId === 'number') {
      return
    }

    if (resolvedEditUrl.current) {
      openSurveyLink(resolvedEditUrl.current)
      return
    }

    setState('CreatingLink')
    const uniqueSurveyId = encodeURI(uuidv4())
    accessibilityCloudFeatureCache
      .getEditPlaceSubmissionUrl(
        placeId,
        `${baseUrl}/contribution-thanks/${placeId}?uniqueSurveyId=${uniqueSurveyId}`,
        tokenString,
      )
      .then((uri) => {
        console.log(uri)
        resolvedEditUrl.current = uri
        setState('Idle')
        setTimeout(() => (resolvedEditUrl.current = null), validLinkDuration)
        openSurveyLink(uri)
      })
      .catch((error) => {
        setState('Error')
        resolvedEditUrl.current = null
        setError(typeof error === 'object' ? error.reason : String(error))
      })
  }, [setState, setError, placeId, baseUrl, tokenString])

  const hasDefaultForm = primarySource && primarySource.defaultKoboForm
  const hasSubmission = hasKoboSubmission(props.feature)
  const canEditSubmission = hasDefaultForm || hasSubmission
  if (!canEditSubmission) {
    return null
  }

  return (
    <section className={props.className}>
      <PrimaryButton disabled={state !== 'Idle'} onClick={createOrOpenEditLink}>
        {t`Add more details`}
        {state === 'CreatingLink' && <Spinner className="loadingIndicator" color="white" />}
      </PrimaryButton>
      {state === 'Error' && (
        <div className="errorBlock">
          <p>{t`Sorry, something went wrong! Please retry later, or write an email to bugs@wheelmap.org if the issue persists.`}</p>
          <p>{error}</p>
        </div>
      )}
    </section>
  )
}

export default styled(EditFormSubmissionButton)`
  margin-top: 12px;
  width: 100%;

  .loadingIndicator {
    margin-left: 12px;
  }

  .errorBlock {
    background: ${colors.negativeColor};
    padding: 12px;
    color: white;
    border-radius: 4px;
    margin-top: 4px;
  }
`
