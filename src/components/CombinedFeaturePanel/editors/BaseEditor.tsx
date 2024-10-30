import React from 'react'
import { AnyFeature } from '../../../lib/model/geo/AnyFeature'

export type BaseEditorProps = {
  tagKey: string
  feature: AnyFeature
  onUrlMutationSuccess: (urls: string[]) => void
}

export type BaseEditorComponent = React.FC<BaseEditorProps>
