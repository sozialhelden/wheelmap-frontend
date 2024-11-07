/* eslint-disable @stylistic/js/max-len */
/* eslint-disable max-len */
import { Accessibility, PersonalProfile } from '@sozialhelden/a11yjson'
import { FC } from 'react'
import { ListEntryYesNoUnknown } from './_ListEntryYesNoUnknown'

const AccessibleWithPersonalProfile: FC<{ isAccessible: boolean | undefined, type: string }> = ({ isAccessible, type }) => (
  <ListEntryYesNoUnknown value={isAccessible} yes={`Offers activities for people with ${type}`} no={`Does not offer activities for people with ${type}`} />
)
export const OffersActivitiesForPeopleWith: FC<{ accessibility: Accessibility | undefined }> = ({ accessibility }) => {
  if (!accessibility?.offersActivitiesForPeopleWith) {
    return null
  }

  const { offersActivitiesForPeopleWith } = accessibility
  const properties = Object.keys(offersActivitiesForPeopleWith) as (keyof PersonalProfile)[]

  if (properties.length <= 0) {
    return null
  }

  if (properties.length === 1) {
    const type = properties[0]
    const isAccessible = offersActivitiesForPeopleWith[type] ?? false
    return <AccessibleWithPersonalProfile isAccessible={isAccessible} type={type} />
  }

  return (
    <li>
      <h2>Activities</h2>
      <ul>{ properties.map((x) => <AccessibleWithPersonalProfile isAccessible={offersActivitiesForPeopleWith[x]} type={x} />)}</ul>
    </li>
  )
}
