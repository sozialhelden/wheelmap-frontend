import { Accessibility } from '@sozialhelden/a11yjson'
import { FC } from 'react'
import { ListEntryYesNoUnknown } from './_ListEntryYesNoUnknown'

export const HasLowStimulusEnvironment: FC<{
  accessibility: Accessibility | undefined;
}> = ({ accessibility }) => (
  <ListEntryYesNoUnknown
    value={accessibility?.hasLowStimulusEnvironment}
    yes="Has a low stimulus environment"
    no="Has no low stimulus environment"
  />
)
