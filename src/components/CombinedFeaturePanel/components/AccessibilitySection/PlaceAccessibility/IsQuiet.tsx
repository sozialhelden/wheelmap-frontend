import { Accessibility } from '@sozialhelden/a11yjson'
import { FC } from 'react'
import { ListEntryYesNoUnknown } from './_ListEntryYesNoUnknown'

export const IsQuiet: FC<{
  accessibility: Accessibility | undefined;
}> = ({ accessibility }) => (
  <ListEntryYesNoUnknown
    value={accessibility?.isQuiet}
    yes="Is generally quiet"
    no="Is possibly loud"
  />
)
