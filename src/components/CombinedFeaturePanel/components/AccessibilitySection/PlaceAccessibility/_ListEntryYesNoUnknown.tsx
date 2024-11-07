import { FC } from 'react'
import { YesNoUnknownText } from './_util'

export const ListEntryYesNoUnknown: FC<{
  title?: string,
  value: boolean | undefined,
  yes?: string,
  no?: string,
  unknown?: string
}> = ({
  title, value, yes, no, unknown,
}) => {
  if (value === undefined && unknown === undefined) {
    return null
  }
  const text = YesNoUnknownText(value, { yes, no, unknown })
  if (title) {
    return (
      <li>
        <div>{title}</div>
        <div>{text}</div>
      </li>
    )
  }
  return <li>{text}</li>
}
