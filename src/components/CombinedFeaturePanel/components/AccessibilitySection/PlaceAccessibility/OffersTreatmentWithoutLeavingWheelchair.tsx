import { Accessibility } from '@sozialhelden/a11yjson'
import { FC } from 'react'
import { ListEntryYesNoUnknown } from './_ListEntryYesNoUnknown'

export const OffersTreatmentWithoutLeavingWheelchair: FC<{
  accessibility: Accessibility | undefined;
}> = ({ accessibility }) => (
  <ListEntryYesNoUnknown
    value={accessibility?.offersTreatmentWithoutLeavingWheelchair}
    yes="Offers treatment without leaving the wheelchair"
    no="Does not offer treatment without leaving the wheelchair"
  />
)
