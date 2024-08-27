import * as React from 'react'
import styled from 'styled-components'
import { t } from 'ttag'

import * as queryString from 'query-string'
import { trackEvent } from '../../lib/apm/Analytics'
import colors from '../../lib/util/colors'
import { ChromelessButton, PrimaryButton } from '../shared/Button'
import CloseLink from '../shared/CloseButton'
import Toolbar from '../shared/Toolbar'

export type Props = {
  className?: string;
  featureId?: string;
  hidden: boolean;
  isExpanded?: boolean;
  onClose: () => void;
  onSelectFeature: (featureId: string) => void;
};

const StyledToolbar = styled(Toolbar)`
  transition: opacity 0.3s ease-out, transform 0.15s ease-out,
    width 0.15s ease-out, height 0.15s ease-out;
  display: flex;
  flex-direction: column;
  padding: 20px 5px 20px 5px;
  border-top: none;
  border-radius: 3px;
  z-index: 1000;
  color: ${colors.textColorTonedDown};

  h2,
  h3 {
    font-weight: 300;
    font-size: 2rem;
    flex: 1;
  }

  > div {
    > header {
      position: sticky;
      display: flex;
      flex-direction: row;
      align-items: center;
      top: 0;
      height: 50px;
      min-height: 50px;
      z-index: 1;
      padding-left: 1rem;
    }

    > section {
      overflow: auto;
      padding: 0 1rem 10px 1rem;
      display: flex;
      flex-direction: column;

      p {
        margin-bottom: 60px;
      }

      > button,
      > a {
        margin-bottom: 12px;
      }
    }
  }
`

export default function ContributionThanksDialog(props: Props) {
  const app = useCurrentApp()

  React.useEffect(() => {
    // log event on client
    if (typeof window !== 'undefined') {
      const queryParams = queryString.parse(window.location.search)
      const { uniqueSurveyId } = queryParams
      if (uniqueSurveyId && typeof uniqueSurveyId === 'string') {
        trackingEventBackend.track(app, {
          type: 'SurveyCompleted',
          uniqueSurveyId,
        })
        trackEvent({
          category: 'Survey',
          action: 'Completed',
          label: uniqueSurveyId,
        })
      }
    }
  }, [app])

  const { featureId } = props
  const className = [
    props.className,
    'contribution-thanks-dialog',
    props.isExpanded && 'is-expanded',
  ]
    .filter(Boolean)
    .join(' ')

  const header = t`Thank you!`
  const text = t`Your change is saved. It can take a while until it appears on the map.`

  const backToPlaceButtonCaption = t`Back to place`
  const backToMapButtonCaption = t`Back to map`

  return (
    <StyledToolbar className={className} hidden={props.hidden} isModal>
      <header>
        <h2>{header}</h2>
        <CloseLink onClick={props.onClose} />
      </header>
      <section>
        <span role="img" aria-label={t`Clapping hands`}>
          👏🏽
        </span>
        <p>{text}</p>
        {featureId && (
          <PrimaryButton onClick={() => props.onSelectFeature(featureId)}>
            {backToPlaceButtonCaption}
          </PrimaryButton>
        )}
        <ChromelessButton onClick={props.onClose}>
          {backToMapButtonCaption}
        </ChromelessButton>
      </section>
    </StyledToolbar>
  )
}
