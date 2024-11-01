import { Accessibility } from '@sozialhelden/a11yjson'
import { FC } from 'react'
import { YesNoUnknownText } from './_util'

export const Parking: FC<{ accessibility: Accessibility | undefined; }> = ({ accessibility }) => {
  if (!accessibility?.parking) {
    return null
  }

  const { parking } = accessibility

  if (parking.count) {
    return <li>No parking spots</li>
  }

  return (
    <li>
      {`${parking.count} parking spots; `}
      {YesNoUnknownText(!!parking.forWheelchairUsers?.count, { yes: 'wheelchair accessible', no: 'not wheelchair accessible' })}
    </li>
  )
}
