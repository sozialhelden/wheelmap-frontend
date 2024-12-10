import { t } from 'ttag'
import React, { useContext } from 'react'
import { Button, TextArea } from '@blueprintjs/core'
import { BaseEditorProps } from './BaseEditor'
import FeatureNameHeader from '../components/FeatureNameHeader'
import FeatureImage from '../components/image/FeatureImage'
import { AppStateLink } from '../../App/AppStateLink'
import { FeaturePanelContext } from '../FeaturePanelContext'
import { StyledReportView } from '../ReportView'

export const StringFieldEditor = ({
  feature, tagKey, onChange, handleSubmitButtonClick,
}: BaseEditorProps) => {
  const { baseFeatureUrl } = useContext(FeaturePanelContext)
  const current = feature.properties?.[tagKey] || ''
  const [value, setValue] = React.useState(current)

  return (
    <StyledReportView>
      <FeatureNameHeader feature={feature}>
        {feature['@type'] === 'osm:Feature' && (
          <FeatureImage feature={feature} />
        )}
      </FeatureNameHeader>
      <h2 className="_title">{t`Editing ${tagKey}`}</h2>

      <TextArea
        className="_textarea"
        placeholder="Enter text here"
        value={value}
        autoFocus
        onChange={(evt) => {
          setValue(evt.target.value)
          onChange(evt.target.value)
        }}
      />

      <footer className="_footer">
        <AppStateLink href={baseFeatureUrl}>
          <div role="button" className="_option _back">Back</div>
        </AppStateLink>
        <Button onClick={handleSubmitButtonClick}>Send</Button>
      </footer>
    </StyledReportView>
  )
}
