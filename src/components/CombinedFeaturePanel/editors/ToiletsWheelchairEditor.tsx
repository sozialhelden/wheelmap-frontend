import React, { useContext, useState } from 'react'
import { Button } from '@blueprintjs/core'
import { FeaturePanelContext } from '../FeaturePanelContext'
import { isOrHasAccessibleToilet } from '../../../lib/model/accessibility/isOrHasAccessibleToilet'
import { YesNoUnknown } from '../../../lib/model/ac/Feature'
import FeatureNameHeader from '../components/FeatureNameHeader'
import FeatureImage from '../components/image/FeatureImage'
import { AccessibilityView } from '../../../pages/[placeType]/[id]/report/send-report-to-ac'
import ToiletStatusAccessibleIcon from '../../icons/accessibility/ToiletStatusAccessible'
import { ToiletStatusNotAccessible } from '../../icons/accessibility'
import { AppStateLink } from '../../App/AppStateLink'
import { BaseEditorProps } from './BaseEditor'
import { StyledReportView } from '../ReportView'

export const ToiletsWheelchairEditor = ({ feature }: BaseEditorProps) => {
  const { baseFeatureUrl } = useContext(FeaturePanelContext)

  const current = isOrHasAccessibleToilet(feature)
  const [option, setOption] = useState<YesNoUnknown | undefined>(current)

  return (
    <StyledReportView className="_view">
      <FeatureNameHeader feature={feature}>
        {feature['@type'] === 'osm:Feature' && (
          <FeatureImage feature={feature} />
        )}
      </FeatureNameHeader>
      <h2 className="_title">How wheelchair accessible is the toilet?</h2>
      <form>
        <AccessibilityView
          onClick={() => {
            setOption('yes')
          }}
          className="_yes"
          inputLabel="accessibility-fully"
          selected={option === 'yes'}
          icon={<ToiletStatusAccessibleIcon />}
          valueName="Yes"
        >
          Entrance has no steps, and all rooms are accessible without steps.
        </AccessibilityView>

        <AccessibilityView
          onClick={() => {
            setOption('no')
          }}
          className="_no"
          inputLabel="accessibility-not-at-all"
          selected={option === 'no'}
          icon={<ToiletStatusNotAccessible />}
          valueName="No"
        >
          Entrance has a high step or several steps, none of the rooms are accessible.
        </AccessibilityView>
      </form>

      <footer className="_footer">
        <AppStateLink href={baseFeatureUrl}>
          <div role="button" className="_option _back">Back</div>
        </AppStateLink>
        <Button disabled>Send</Button>
      </footer>
    </StyledReportView>
  )
}
