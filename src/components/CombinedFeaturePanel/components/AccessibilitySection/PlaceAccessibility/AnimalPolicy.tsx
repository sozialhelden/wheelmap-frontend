/* eslint-disable @stylistic/js/max-len */
/* eslint-disable max-len */
import { Accessibility } from '@sozialhelden/a11yjson'
import { FC } from 'react'
import { YesNoUnknownText } from './_util'

export const AnimalPolicy: FC<{ accessibility: Accessibility | undefined; }> = ({ accessibility }) => {
  if (!accessibility?.animalPolicy) {
    return null
  }

  const { animalPolicy } = accessibility
  return (
    <li>
      Allowance:
      <ul>
        <li>
          Allows dogs:
          {animalPolicy.allowsDogs}
        </li>
        <li>
          Allows Assistant Dogs:
          {animalPolicy.allowsAssistanceDogs}
        </li>
        <li>
          Allows Guidance Dogs:
          {animalPolicy.allowsGuideDogs}
        </li>
        <li>
          Allows Service Animals:
          {animalPolicy.allowsServiceAnimals}
        </li>
        <li>
          {YesNoUnknownText(animalPolicy.dogsNeedMuzzle, { yes: 'Dogs require a muzzle', no: 'Dogs require no muzzle', unknown: '' })}
        </li>
        <li>
          {YesNoUnknownText(animalPolicy.suppliesWaterForPets, { yes: 'Supplies water to animals', no: 'Does not supply water for animals', unknown: '' })}
        </li>
      </ul>
    </li>
  )
}
