import { FC } from 'react'
import { YesNoUnknownText } from './_util'

export const ListEntryYesNoUnknown: FC<{
  value: boolean | undefined,
  yes?: string,
  no?: string,
  unknown?: string
}> = ({
  value, yes, no, unknown,
}) => (value === undefined && unknown === undefined ? null : <li>{YesNoUnknownText(value, { yes, no, unknown })}</li>)
