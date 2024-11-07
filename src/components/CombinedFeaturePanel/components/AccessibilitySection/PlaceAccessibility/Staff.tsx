import { Accessibility } from '@sozialhelden/a11yjson'
import { FC } from 'react'
import { YesNoUnknownText } from './_util'

export const Staff: FC<{ accessibility: Accessibility | undefined; }> = ({ accessibility }) => {
  if (!accessibility?.staff) {
    return null
  }

  const { staff } = accessibility
  const keys = Object.keys(staff) as (keyof typeof staff)[]
  if (keys.length <= 0) {
    return null
  }

  return (
    <li>
      <h2>Staff</h2>
      {YesNoUnknownText(staff.hasFreeAssistantForVisitors, { yes: 'free assistance for visitors; ', no: 'paid assistance for visitors; ' })}
      {YesNoUnknownText(staff.canSeeVisitorsFromInside, { yes: 'can see visitors from inside; ', no: 'cannot see visitors from inside; ' })}
      {staff.languages && `speaks ${staff.languages.join(', ')}`}
    </li>
  )
}
