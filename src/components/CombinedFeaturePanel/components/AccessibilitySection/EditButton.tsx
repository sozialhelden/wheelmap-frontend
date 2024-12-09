import React from 'react'
import { t } from 'ttag'
import { AppStateLink } from '../../../App/AppStateLink'
import { Button, IconButton } from '@radix-ui/themes';
import { MagnifyingGlassIcon, Pencil1Icon, Pencil2Icon } from '@radix-ui/react-icons';

export function EditButton({ editURL }: { editURL: string; }) {
  return (
    <AppStateLink
      href={editURL}
    >
      <IconButton
        aria-label={t`Edit`}
        tabIndex={-1}
        variant="soft"
      >
        <Pencil1Icon width="18" height="18" />
      </IconButton>
    </AppStateLink>
  )
}
