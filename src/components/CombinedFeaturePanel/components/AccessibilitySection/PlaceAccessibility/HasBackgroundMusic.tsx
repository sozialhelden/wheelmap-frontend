import { Accessibility } from '@sozialhelden/a11yjson'
import { FC } from 'react'
import { ListEntryYesNoUnknown } from './_ListEntryYesNoUnknown'

export const HasBackgroundMusic: FC<{
  accessibility: Accessibility | undefined;
}> = ({ accessibility }) => (
  <ListEntryYesNoUnknown
    value={accessibility?.hasBackgroundMusic}
    yes="Has background music"
    no="Has no background music"
  />
)
