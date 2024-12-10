import { Pencil1Icon } from '@radix-ui/react-icons';
import { IconButton } from '@radix-ui/themes';
import { t } from 'ttag';
import { AppStateLink } from '../../../App/AppStateLink';

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
