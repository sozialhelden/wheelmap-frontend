import { t } from 'ttag'
import React, { useContext } from 'react'
import { BaseEditorProps } from './BaseEditor'
import { WheelchairEditor } from './WheelchairEditor'
import { ToiletsWheelchairEditor } from './ToiletsWheelchairEditor'
import { StringFieldEditor } from './StringFieldEditor'
import { AppStateLink } from '../../App/AppStateLink'
import FeatureNameHeader from '../components/FeatureNameHeader'
import FeatureImage from '../components/image/FeatureImage'
import { FeaturePanelContext } from '../FeaturePanelContext'
import { StyledReportView } from '../ReportView'

type AutoEditorProps = BaseEditorProps

const EditorMapping: Record<string, React.FC<BaseEditorProps> | undefined> = {
  wheelchair: WheelchairEditor,
  'toilets:wheelchair': ToiletsWheelchairEditor,
  'wheelchair:description': StringFieldEditor,
}

export const AutoEditor = ({ feature, tagKey }: AutoEditorProps) => {
  const { baseFeatureUrl } = useContext(FeaturePanelContext)

  const Editor = EditorMapping[tagKey]
  if (Editor) {
    return <Editor feature={feature} tagKey={tagKey} />
  }

  return (
    <StyledReportView>
      <FeatureNameHeader feature={feature}>
        {feature['@type'] === 'osm:Feature' && (
          <FeatureImage feature={feature} />
        )}
      </FeatureNameHeader>
      <h2 className="_title">{t`No editor available for ${tagKey}`}</h2>
      <footer className="_footer">
        <AppStateLink href={baseFeatureUrl}>
          <div role="button" className="_option _back">Back</div>
        </AppStateLink>
      </footer>
    </StyledReportView>
  )
}
