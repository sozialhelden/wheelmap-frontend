import React, {useCallback, useContext, useState} from 'react'
import { Button } from '@blueprintjs/core'
import { YesNoUnknown } from '../../../lib/model/ac/Feature'
import { FeaturePanelContext } from '../FeaturePanelContext'
import { isOrHasAccessibleToilet } from '../../../lib/model/accessibility/isOrHasAccessibleToilet'
import FeatureNameHeader from '../components/FeatureNameHeader'
import FeatureImage from '../components/image/FeatureImage'
import { AccessibilityView } from '../../../pages/[placeType]/[id]/report/send-report-to-ac'
import ToiletStatusAccessibleIcon from '../../icons/accessibility/ToiletStatusAccessible'
import { ToiletStatusNotAccessible } from '../../icons/accessibility'
import { AppStateLink } from '../../App/AppStateLink'
import { BaseEditorProps } from './BaseEditor'
import { StyledReportView } from '../ReportView'

export const ToiletsWheelchairEditor = ({ feature, onChange, handleSubmitButtonClick }: BaseEditorProps) => {
  const { baseFeatureUrl } = useContext(FeaturePanelContext)

  const current = isOrHasAccessibleToilet(feature)
  const [editedTagValue, setEditedTagValue] = useState<YesNoUnknown | undefined>(current)

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
            setEditedTagValue('yes')
            onChange('yes')
          }}
          className="_yes"
          inputLabel="accessibility-fully"
          selected={editedTagValue === 'yes'}
          icon={<ToiletStatusAccessibleIcon />}
          valueName="Yes"
        >
          Entrance has no steps, and all rooms are accessible without steps.
        </AccessibilityView>

        <AccessibilityView
          onClick={() => {
            setEditedTagValue('no')
            onChange('no')
          }}
          className="_no"
          inputLabel="accessibility-not-at-all"
          selected={editedTagValue === 'no'}
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
        <Button onClick={handleSubmitButtonClick}>Send</Button>
      </footer>
    </StyledReportView>
  )
}
