import React from 'react'
import { AnyFeature } from '../../../lib/model/geo/AnyFeature'

export interface BaseEditorProps {
  tagKey: string
  feature: AnyFeature
}

export type BaseEditorComponent = React.FC<BaseEditorProps>
