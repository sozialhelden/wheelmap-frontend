import { Accessibility } from '@sozialhelden/a11yjson'
import { FC } from 'react'

export const SignageSystems: FC<{ accessibility: Accessibility | undefined; }> = ({ accessibility }) => {
  if (!accessibility?.signageSystems) {
    return null
  }

  const { signageSystems } = accessibility

  if (signageSystems.length <= 0) {
    return null
  }
  return (
    <>
      <h2>Signage Systems</h2>
      <ul>
        {/* I'm a mere mortal, may the chores of hard labor fall unto you and may you implement this yourself */}
        {/* eslint-disable-next-line react/no-array-index-key */}
        {signageSystems.map((x, i) => (<li key={i}><pre>{JSON.stringify(x, undefined, 2)}</pre></li>))}
      </ul>
    </>
  )
}
