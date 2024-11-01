import { Accessibility } from '@sozialhelden/a11yjson'
import { FC } from 'react'
import { quantityToString } from './_util'

export const AmbientNoiseLevel: FC<{ accessibility: Accessibility | undefined; }> = ({ accessibility }) => {
  if (!accessibility?.ambientNoiseLevel) {
    return null
  }
  return (
    <li>
      Ambient Noise Level:
      {quantityToString(accessibility.ambientNoiseLevel) ?? `${accessibility.ambientNoiseLevel} db(A)`}
    </li>
  )
}
