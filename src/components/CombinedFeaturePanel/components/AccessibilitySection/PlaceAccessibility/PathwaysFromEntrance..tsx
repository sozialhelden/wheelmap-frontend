import { Accessibility } from '@sozialhelden/a11yjson'
import { FC } from 'react'
import { YesNoUnknownText } from './_util'

export const PathwaysFromEntrance: FC<{ accessibility: Accessibility | undefined; }> = ({ accessibility }) => {
  if (!accessibility?.pathwaysFromEntrance) {
    return null
  }

  const { pathwaysFromEntrance } = accessibility
  const keys = Object.keys(pathwaysFromEntrance) as (keyof typeof pathwaysFromEntrance)[]
  if (keys.length <= 0) {
    return null
  }

  return (
    <li>
      Pathway:
      {YesNoUnknownText(pathwaysFromEntrance.isKerbstoneFree, { yes: 'with no kerbstones; ', no: 'with kerbstones; ' })}
      {pathwaysFromEntrance.width && `width: ${pathwaysFromEntrance.width}; `}
      {pathwaysFromEntrance.widthAtObstacles && `width at obstacles: ${pathwaysFromEntrance.widthAtObstacles}; `}
    </li>
  )
}
