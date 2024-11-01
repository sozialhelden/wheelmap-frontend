import { Accessibility } from '@sozialhelden/a11yjson'
import { FC } from 'react'

const AccessibleWithPersonalProfile: FC<{ isAccessible: boolean, type: string }> = ({ isAccessible, type }) => (
  <li>
    {isAccessible ? 'Accessible with ' : 'Not accessible with '}
    {type}
  </li>
)
export const AccessibleWith: FC<{ accessibility: Accessibility | undefined }> = ({ accessibility }) => {
  if (!accessibility?.accessibleWith) {
    return null
  }

  const { accessibleWith } = accessibility
  const properties = Object.keys(accessibleWith) as (keyof Accessibility)[]

  if (properties.length <= 0) {
    return null
  }

  if (properties.length === 1) {
    const type = properties[0]
    const isAccessible = accessibleWith[type] ?? false
    return <AccessibleWithPersonalProfile isAccessible={isAccessible} type={type} />
  }

  return (
    <li>
      Accessible with:
      <ul>{ properties.map((x) => <AccessibleWithPersonalProfile isAccessible={accessibleWith[x]} type={x} />)}</ul>
    </li>
  )
}
