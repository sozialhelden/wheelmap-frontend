/* eslint-disable @typescript-eslint/indent */
import { Accessibility } from '@sozialhelden/a11yjson'
import { FC } from 'react'

export const SmokingPolicy: FC<{ accessibility: Accessibility | undefined; }> = ({ accessibility }) => {
  if (!accessibility?.smokingPolicy) {
    return null
  }

  const { smokingPolicy } = accessibility

  switch (smokingPolicy) {
  case 'allowedEverywhere':
    return <li>Smoking is allowed everywhere</li>
  case 'dedicatedToSmoking':
    return <li>There is a dedicated smoking area</li>
  case 'inIsolatedArea':
    return <li>There is an isolated smoking area</li>
  case 'inSeparateArea':
    return <li>Smoking is allowed in a separate area</li>
  case 'onlyOutside':
    return <li>Smoking is permitted outside</li>
  case 'prohibited':
    return <li>Smoking is strictly prohibited</li>
  default:
    return null
  }
}
