import { Accessibility } from '@sozialhelden/a11yjson'
import { FC } from 'react'
import { FoldablePre } from './_FoldablePre'

export const AvailableEquipment: FC<{ accessibility: Accessibility | undefined; }> = ({ accessibility }) => {
  if (!accessibility?.availableEquipment) {
    return null
  }

  const { availableEquipment } = accessibility

  if (availableEquipment.length <= 0) {
    return null
  }
  return (
    <li>
      <h2>Available Equipment</h2>
      <ul>
        {/* I'm a mere mortal, may the chores of hard labor fall unto you and may you implement this yourself */}
        {/* eslint-disable-next-line react/no-array-index-key */}
        {
          availableEquipment.map(
          // eslint-disable-next-line react/no-array-index-key
            (x, i) => (<li key={i}><FoldablePre defaultFolding="unfolded">{JSON.stringify(x, undefined, 2)}</FoldablePre></li>),
          )
        }
      </ul>
    </li>
  )
}
