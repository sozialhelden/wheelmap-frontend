import { Accessibility } from '@sozialhelden/a11yjson'
import { FC } from 'react'

export const Restrooms: FC<{ accessibility: Accessibility | undefined; }> = ({ accessibility }) => {
  if (!accessibility?.restrooms) {
    return null
  }

  const { restrooms } = accessibility

  if (restrooms.length <= 0) {
    return null
  }
  return (
    <>
      {/* I'm a mere mortal, may the chores of hard labor fall unto you and may you implement this yourself */}
      {/* eslint-disable-next-line react/no-array-index-key */}
      {restrooms.map((x, i) => (<li key={i}><pre>{JSON.stringify(x, undefined, 2)}</pre></li>))}
    </>
  )
}
