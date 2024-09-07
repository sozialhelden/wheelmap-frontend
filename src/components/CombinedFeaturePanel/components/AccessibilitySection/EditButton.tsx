import { AnchorButton } from '@blueprintjs/core'
import { ROUND } from '@blueprintjs/core/lib/esm/common/classes';
import React from 'react'
import { t } from 'ttag'

export function EditButton({ editURL }: { editURL: string; }) {
  return (
    <AnchorButton
      aria-label={t`Edit`}
      icon="edit"
      href={editURL}
    />
  )
}
