import React from 'react'
import { Button } from '@blueprintjs/core'
import { t } from 'ttag'
import { AppStateLink } from '../../../App/AppStateLink'

export function EditButton({ editURL }: { editURL: string; }) {
  return (
    <AppStateLink
      href={editURL}
    >
      <Button
        aria-label={t`Edit`}
        icon="edit"
      />
    </AppStateLink>
  )
}
