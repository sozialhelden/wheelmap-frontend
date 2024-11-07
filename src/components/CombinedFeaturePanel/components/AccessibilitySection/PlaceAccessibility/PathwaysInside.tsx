import { Accessibility } from '@sozialhelden/a11yjson'
import { FC } from 'react'
import { YesNoUnknownText } from './_util'

export const PathwaysInside: FC<{ accessibility: Accessibility | undefined; }> = ({ accessibility }) => {
  if (!accessibility?.pathwaysInside) {
    return null
  }

  const { pathwaysInside } = accessibility
  const keys = Object.keys(pathwaysInside) as (keyof typeof pathwaysInside)[]
  if (keys.length <= 0) {
    return null
  }

  return (
    <li>
      <h2>Pathway (inside)</h2>
      {YesNoUnknownText(pathwaysInside.isKerbstoneFree, { yes: 'with no kerbstones; ', no: 'with kerbstones; ' })}
      {pathwaysInside.width && `width: ${pathwaysInside.width}; `}
      {pathwaysInside.widthAtObstacles && `width at obstacles: ${pathwaysInside.widthAtObstacles}; `}
    </li>
  )
}
