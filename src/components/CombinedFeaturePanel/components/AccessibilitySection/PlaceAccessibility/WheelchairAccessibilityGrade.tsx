/* eslint-disable indent */
/* eslint-disable @stylistic/js/indent */
import { Accessibility } from '@sozialhelden/a11yjson'
import { FC } from 'react'

export const WheelchairAccessibilityGrade: FC<{ accessibility: Accessibility | undefined; }> = ({ accessibility }) => {
  if (!accessibility?.wheelchairAccessibilityGrade) {
    return null
  }

  const { wheelchairAccessibilityGrade } = accessibility
  switch (wheelchairAccessibilityGrade) {
    case 'fully':
      return (
        <li>
          <h2>Wheelchair Accessibility Grade</h2>
          Fully wheelchair accessible
        </li>
      )
    case 'partially':
      return (
        <li>
          <h2>Wheelchair Accessibility Grade</h2>
          Partially wheelchair accessible
        </li>
      )
    case 'not':
      return (
        <li>
          <h2>Wheelchair Accessibility Grade</h2>
          Not wheelchair accessible
        </li>
      )
    default:
      return null
  }
}
