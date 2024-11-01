import { Accessibility } from '@sozialhelden/a11yjson'
import { FC } from 'react'
import { ListEntryYesNoUnknown } from './_ListEntryYesNoUnknown'

export const HasAirConditioning: FC<{
  accessibility: Accessibility | undefined;
}> = ({ accessibility }) => (
  <ListEntryYesNoUnknown
    value={accessibility?.hasAirConditioning}
    yes="Has Air Conditioning"
    no="Has no Air Conditioning"
  />
)
