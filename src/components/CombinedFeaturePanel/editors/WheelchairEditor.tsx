import React, { useContext, useState } from 'react'
import { Button } from '@blueprintjs/core'
import { useCurrentLanguageTagStrings } from '../../../lib/context/LanguageTagContext'
import { FeaturePanelContext } from '../FeaturePanelContext'
import { useFeatureLabel } from '../utils/useFeatureLabel'
import { isWheelchairAccessible } from '../../../lib/model/accessibility/isWheelchairAccessible'
import { unknownCategory } from '../../../lib/model/ac/categories/Categories'
import FeatureNameHeader from '../components/FeatureNameHeader'
import FeatureImage from '../components/image/FeatureImage'
import { AccessibilityView } from '../../../pages/[placeType]/[id]/report/send-report-to-ac'
import Icon from '../../shared/Icon'
import { AppStateLink } from '../../App/AppStateLink'
import { BaseEditorProps } from './BaseEditor'
import { StyledReportView } from '../ReportView'
import { YesNoLimitedUnknown } from '../../../lib/model/ac/Feature'

export const WheelchairEditor = ({ feature, setParentState, handleSubmitButtonClick }: BaseEditorProps) => {
  const languageTags = useCurrentLanguageTagStrings()
  const { baseFeatureUrl } = useContext(FeaturePanelContext)

  const {
    category,
    categoryTagKeys,
  } = useFeatureLabel({
    feature,
    languageTags,
  })

  const current = isWheelchairAccessible(feature)

  const cat = ((category && category !== unknownCategory) ? category._id : categoryTagKeys[0]) || 'undefined'
  const [editedTagValue, setEditedTagValue] = useState<YesNoLimitedUnknown | undefined>(current)

  const handleClick = () => {
    // setParentState(editedTagValue)
    handleSubmitButtonClick()
  }

  return (
    <StyledReportView className="_view">
      <FeatureNameHeader feature={feature}>
        {feature['@type'] === 'osm:Feature' && (
          <FeatureImage feature={feature} />
        )}
      </FeatureNameHeader>
      <h2 className="_title">How wheelchair accessible is this place?</h2>
      <form>
        <AccessibilityView
          onClick={() => {
            setEditedTagValue('yes')
            setParentState('yes')
          }}
          className="_yes"
          inputLabel="accessibility-fully"
          selected={editedTagValue === 'yes'}
          icon={<Icon size="medium" accessibility="yes" category={cat} />}
          valueName="Fully"
        >
          Entrance has no steps, and all rooms are accessible without steps.
        </AccessibilityView>
        <AccessibilityView
          onClick={() => {
            setEditedTagValue('limited')
            setParentState('limited')
          }}
          className="_okay"
          inputLabel="accessibility-partially"
          selected={editedTagValue === 'limited'}
          icon={<Icon size="medium" accessibility="limited" category={cat} />}
          valueName="Partially"
        >
          Entrance has one step with max. 3 inches height, most rooms are without steps
        </AccessibilityView>

        <AccessibilityView
          onClick={() => {
            setEditedTagValue('no')
            setParentState('no')
          }}
          className="_no"
          inputLabel="accessibility-not-at-all"
          selected={editedTagValue === 'no'}
          icon={<Icon size="medium" accessibility="no" category={cat} />}
          valueName="Not at all"
        >
          Entrance has a high step or several steps, none of the rooms are accessible.
        </AccessibilityView>
      </form>

      <footer className="_footer">
        <AppStateLink href={baseFeatureUrl}>
          <div role="button" className="_option _back">Back</div>
        </AppStateLink>
        <Button onClick={handleClick}>Send</Button>
      </footer>
    </StyledReportView>
  )
}
