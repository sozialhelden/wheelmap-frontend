import { Accessibility } from '@sozialhelden/a11yjson'
import { FC } from 'react'

const PartiallyAccessibleWithProfile: FC<{ isAccessible: boolean, type: string }> = ({ isAccessible, type }) => (
  <li>
    {isAccessible ? 'Partially accessible with ' : 'Not accessible with '}
    {type}
  </li>
)
export const PartiallyAccessibleWith: FC<{ accessibility: Accessibility | undefined }> = ({ accessibility }) => {
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
      <h2>Partially Accessible</h2>
      { /* eslint-disable-next-line react/no-array-index-key */ }
      <ul>{ properties.map((x, i) => <PartiallyAccessibleWithProfile key={i} isAccessible={accessibleWith[x]} type={x} />)}</ul>
    </li>
  )
}
