/* eslint-disable @stylistic/js/max-len */
/* eslint-disable max-len */
import { Accessibility } from '@sozialhelden/a11yjson'
import { FC } from 'react'
import { YesNoUnknownText } from './_util'

export const QueueSystem: FC<{ accessibility: Accessibility | undefined; }> = ({ accessibility }) => {
  if (!accessibility?.queueSystem) {
    return null
  }

  const { queueSystem } = accessibility
  const keys = Object.keys(queueSystem) as (keyof typeof queueSystem)[]
  if (keys.length <= 0) {
    return null
  }

  return (
    <li>
      <h2>Queue system</h2>
      {YesNoUnknownText(queueSystem.canSkipQueueWithDisability, { yes: 'can skip queue with disability; ', no: 'cannot skip queue with disability; ' })}
      {YesNoUnknownText(queueSystem.usesCattleBars, { yes: 'has cattle bars; ', no: 'has no cattle bars; ' })}
      {YesNoUnknownText(queueSystem.hasVisualAnnouncements, { yes: 'has visual announcement; ', no: 'does not have visual announcements; ' })}
      {YesNoUnknownText(queueSystem.needsTickets, { yes: 'needs tickets; ', no: 'does not need tickets; ' })}
      {YesNoUnknownText(queueSystem.usesCattleBars, { yes: 'can skip queue with disability; ', no: 'cannot skip queue with disability; ' })}
    </li>
  )
}
