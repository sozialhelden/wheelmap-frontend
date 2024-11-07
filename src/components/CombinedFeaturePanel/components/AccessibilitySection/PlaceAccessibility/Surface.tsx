import { Accessibility } from '@sozialhelden/a11yjson'
import { FC } from 'react'

export const Surface: FC<{ accessibility: Accessibility | undefined; }> = ({ accessibility }) => {
  if (!accessibility?.surface) {
    return null
  }

  const { surface } = accessibility
  const keys = Object.keys(surface) as (keyof typeof surface)[]
  if (keys.length <= 0) {
    return null
  }

  return <li>There certainly is some surface, the developer forgot to implement it, however.</li>
}
