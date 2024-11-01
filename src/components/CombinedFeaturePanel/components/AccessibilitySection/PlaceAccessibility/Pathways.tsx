import { Accessibility } from '@sozialhelden/a11yjson'
import { FC } from 'react'
import { YesNoUnknownText } from './_util'

export const Pathways: FC<{ accessibility: Accessibility | undefined; }> = ({ accessibility }) => {
  if (!accessibility?.pathways) {
    return null
  }

  const { pathways } = accessibility
  const keys = Object.keys(pathways) as (keyof typeof pathways)[]
  if (keys.length <= 0) {
    return null
  }

  return (
    <li>
      Pathway:
      {YesNoUnknownText(pathways.isKerbstoneFree, { yes: 'with no kerbstones; ', no: 'with kerbstones; ' })}
      {pathways.width && `width: ${pathways.width}; `}
      {pathways.widthAtObstacles && `width at obstacles: ${pathways.widthAtObstacles}; `}
    </li>
  )
}
