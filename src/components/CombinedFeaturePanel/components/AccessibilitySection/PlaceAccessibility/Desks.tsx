import { Accessibility } from '@sozialhelden/a11yjson'
import { FC } from 'react'
import { FoldablePre } from './_FoldablePre'

export const Desks: FC<{ accessibility: Accessibility | undefined; }> = ({ accessibility }) => {
  if (!accessibility?.desks) {
    return null
  }

  const { desks } = accessibility

  if (desks.length <= 0) {
    return null
  }
  return (
    <li>
      <h2>Desks</h2>
      <ul>
        {/* I'm a mere mortal, may the chores of hard labor fall unto you and may you implement this yourself */}
        {/* eslint-disable-next-line react/no-array-index-key */}
        {desks.map((x, i) => (<li key={i}><FoldablePre defaultFolding="unfolded">{JSON.stringify(x, undefined, 2)}</FoldablePre></li>))}
      </ul>
    </li>
  )
}
