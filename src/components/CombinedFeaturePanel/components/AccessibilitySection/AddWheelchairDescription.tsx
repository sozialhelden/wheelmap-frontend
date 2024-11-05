import React, { useContext } from 'react'
import { EditButton } from './EditButton'
import { FeaturePanelContext } from '../../FeaturePanelContext'

export default function AddWheelchairDescription({}) {
  const { baseFeatureUrl } = useContext(FeaturePanelContext)
  const key = 'wheelchair:description'
  const editURL = `${baseFeatureUrl}/edit/${key}`
  const editButton = <EditButton editURL={editURL} />
  return (
    editButton
  )
}
