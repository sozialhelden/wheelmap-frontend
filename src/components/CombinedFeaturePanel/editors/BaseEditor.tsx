import React from 'react'
import { AnyFeature } from '../../../lib/model/geo/AnyFeature'
import { EditorTagValue } from './EditorTagValue'

export type BaseEditorProps = {
  tagKey: string
  feature: AnyFeature
  onUrlMutationSuccess: (urls: string[]) => void
  setParentState: (tagValue: EditorTagValue) => void
  handleSubmitButtonClick: () => void
}

export type BaseEditorComponent = React.FC<BaseEditorProps>
