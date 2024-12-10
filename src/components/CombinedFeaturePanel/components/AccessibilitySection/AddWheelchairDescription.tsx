import React, { useContext } from 'react'
import { EditButton } from './EditButton'
import { FeaturePanelContext } from '../../FeaturePanelContext'
import {normalizeLanguageTag, useCurrentLanguageTagStrings} from '../../../../lib/context/LanguageTagContext'

export default function AddWheelchairDescription() {
  const { baseFeatureUrl } = useContext(FeaturePanelContext)
  const languageTags = useCurrentLanguageTagStrings()
  const normalizedLanguageTag = normalizeLanguageTag(languageTags[0])
  const key = `wheelchair:description:${normalizedLanguageTag}`
  const editURL = `${baseFeatureUrl}/edit/${key}`
  const editButton = <EditButton editURL={editURL} />
  return (
    editButton
  )
}
