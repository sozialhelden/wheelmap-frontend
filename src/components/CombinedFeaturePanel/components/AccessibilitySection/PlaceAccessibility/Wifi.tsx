import { Accessibility } from '@sozialhelden/a11yjson'
import { FC } from 'react'
import { YesNoUnknownText } from './_util'

export const Wifi: FC<{ accessibility: Accessibility | undefined; }> = ({ accessibility }) => {
  if (!accessibility?.wifi) {
    return null
  }

  const { wifi } = accessibility
  const keys = Object.keys(wifi) as (keyof typeof wifi)[]
  if (keys.length <= 0) {
    return null
  }

  return (
    <li>
      <h2>Wifi Accessibility</h2>
      {wifi.access && `${wifi.access}; `}
      {wifi.ssid && `ssid: ${wifi.ssid}; `}
      {wifi.password && `password: ${wifi.password} ; `}
      {wifi.descriptionWhereToGetLoginData && `${wifi.descriptionWhereToGetLoginData}`}
      {YesNoUnknownText(!!wifi.usageFee, { yes: 'free use; ', no: '' })}
      {YesNoUnknownText(wifi.isOpenToEveryone, { yes: 'accessible for anyone; ', no: 'inaccessible for everyone; ' })}
      {YesNoUnknownText(wifi.isOpenToVisitors, { yes: 'accessible for visitors; ', no: 'inaccessible for visitors; ' })}
      {YesNoUnknownText(wifi.isOpenToStaff, { yes: 'accessible for staff; ', no: 'inaccessible for staff; ' })}
      {YesNoUnknownText(wifi.needsGuestPass, { yes: 'needs a guest password; ', no: 'no guest password; ' })}
      {YesNoUnknownText(wifi.hasCaptivePortal, { yes: 'has captive portal; ', no: 'no captive portal; ' })}
      {YesNoUnknownText(wifi.isCaptivePortalAccessible, { yes: 'accessible captive portal; ', no: 'inaccessible captive portal; ' })}
    </li>
  )
}
