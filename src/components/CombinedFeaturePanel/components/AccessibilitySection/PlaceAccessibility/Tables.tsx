import { Accessibility } from '@sozialhelden/a11yjson'
import { FC } from 'react'

export const Tables: FC<{ accessibility: Accessibility | undefined; }> = ({ accessibility }) => {
  if (!accessibility?.tables) {
    return null
  }

  const { tables } = accessibility

  if (tables.length <= 0) {
    return null
  }
  return (
    <>
      {/* I'm a mere mortal, may the chores of hard labor fall unto you and may you implement this yourself */}
      {/* eslint-disable-next-line react/no-array-index-key */}
      {tables.map((x, i) => (<li key={i}><pre>{JSON.stringify(x, undefined, 2)}</pre></li>))}
    </>
  )
}
