import { AnchorButton } from '@blueprintjs/core'
import React from 'react'
import { t } from 'ttag'

export function EditButton({ editURL }: { editURL: string; }) {
  return (
    <AnchorButton
      aria-label={t`Edit`}
      icon="edit"
      minimal
      small
      href={editURL}
    />
  )
}
