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
  return (
    <li>
      <h2>Accessibility</h2>
      { /* eslint-disable-next-line react/no-array-index-key */ }
      <ul>{ properties.map((x, i) => <AccessibleWithPersonalProfile key={i} isAccessible={accessibleWith[x]} type={x} />)}</ul>
    </li>
  )
}
