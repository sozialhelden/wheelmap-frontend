import { Accessibility } from '@sozialhelden/a11yjson'
import { FC } from 'react'

export const Media: FC<{ accessibility: Accessibility | undefined; }> = ({ accessibility }) => {
  if (!accessibility?.media) {
    return null
  }

  const { media } = accessibility

  if (media.length <= 0) {
    return null
  }
  return (
    <>
      {/* I'm a mere mortal, may the chores of hard labor fall unto you and may you implement this yourself */}
      {/* eslint-disable-next-line react/no-array-index-key */}
      {media.map((x, i) => (<li key={i}><pre>{JSON.stringify(x, undefined, 2)}</pre></li>))}
    </>
  )
}
