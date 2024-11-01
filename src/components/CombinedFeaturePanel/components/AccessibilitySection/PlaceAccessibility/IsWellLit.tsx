import { Accessibility } from '@sozialhelden/a11yjson'
import { FC } from 'react'
import { ListEntryYesNoUnknown } from './_ListEntryYesNoUnknown'

export const IsWellLit: FC<{
  accessibility: Accessibility | undefined;
}> = ({ accessibility }) => (
  <ListEntryYesNoUnknown
    value={accessibility?.isWellLit}
    yes="Is well lit"
    no="Is dimly lit"
  />
)
