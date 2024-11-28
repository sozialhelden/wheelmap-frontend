import React, { useContext } from 'react'
import { EditButton } from './EditButton'
import { FeaturePanelContext } from '../../FeaturePanelContext'
import { useCurrentLanguageTagStrings } from '../../../../lib/context/LanguageTagContext'

export default function AddWheelchairDescription() {
  const { baseFeatureUrl } = useContext(FeaturePanelContext)
  const languageTags = useCurrentLanguageTagStrings()
  const key = `wheelchair:description:${languageTags[0]}`
  const editURL = `${baseFeatureUrl}/edit/${key}`
  const editButton = <EditButton editURL={editURL} />
  return (
    editButton
  )
}
