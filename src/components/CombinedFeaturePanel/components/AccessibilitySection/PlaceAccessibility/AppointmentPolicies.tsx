import { Accessibility } from '@sozialhelden/a11yjson'
import { FC } from 'react'
import { FoldablePre } from './_FoldablePre'

export const AppointmentPolicies: FC<{ accessibility: Accessibility | undefined; }> = ({ accessibility }) => {
  if (!accessibility?.appointmentPolicies) {
    return null
  }

  const { appointmentPolicies } = accessibility

  if (appointmentPolicies.length <= 0) {
    return null
  }
  return (
    <li>
      <h2>Appointment Policies</h2>
      <ul>
        {/* I'm a mere mortal, may the chores of hard labor fall unto you and may you implement this yourself */}
        {/* eslint-disable-next-line react/no-array-index-key */}
        {
          appointmentPolicies.map((x, i) => (
          // eslint-disable-next-line react/no-array-index-key
            <li key={i}><FoldablePre defaultFolding="unfolded">{JSON.stringify(x, undefined, 2)}</FoldablePre></li>
          ))
        }
      </ul>
    </li>
  )
}
