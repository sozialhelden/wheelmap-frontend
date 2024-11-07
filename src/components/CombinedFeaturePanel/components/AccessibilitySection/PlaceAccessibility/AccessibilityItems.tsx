/* eslint-disable max-len */
import styled from 'styled-components'
import { FC } from 'react'
import { AnyFeature, isPlaceInfo } from '../../../../../lib/model/geo/AnyFeature'
import { AccessibleWith } from './AccessibleWith'
import { AmbientNoiseLevel } from './AmbientNoiseLevel'
import { AnimalPolicy } from './AnimalPolicy'
import { AppointmentPolicies } from './AppointmentPolicies'
import { AvailableEquipment } from './AvailableEquipment'
import { Desks } from './Desks'
import { HasAirConditioning } from './HasAirConditioning'
import { Entrances } from './Entrances'
import { HasBackgroundMusic } from './HasBackgroundMusic'
import { HasInductionLoop } from './HasInductionLoop'
import { HasLowStimulusEnvironment } from './HasLowStimulusEnvironment'
import { HasPatientLifter } from './HasPatientLifter'
import { HasSoundAbsorption } from './HasSoundAbsorption'
import { Interactions } from './Interactions'
import { IsQuiet } from './IsQuiet'
import { IsWellLit } from './IsWellLit'
import { Media } from './Media'
import { OffersActivitiesForPeopleWith } from './OffersActivitiesForPeopleWith'
import { OffersTreatmentWithoutLeavingWheelchair } from './OffersTreatmentWithoutLeavingWheelchair'
import { Parking } from './Parking'
import { PartiallyAccessibleWith } from './PartiallyAccessibleWith'
import { Pathways } from './Pathways'
import { PathwaysFromEntrance } from './PathwaysFromEntrance.'
import { PathwaysInside } from './PathwaysInside'
import { Payment } from './Payment'
import { QueueSystem } from './QueueSystem'
import { Restrooms } from './Restrooms'
import colors from '../../../../../lib/util/colors'
import { Rooms } from './Rooms'
import { ServiceContact } from './ServiceContact'
import { SignageSystems } from './SignageSystems'
import { SmokingPolicy } from './SmokingPolicy'
import { Staff } from './Staff'
import { Surface } from './Surface'
import { Tables } from './Tables'
import { WheelchairAccessibilityGrade } from './WheelchairAccessibilityGrade'
import { WheelchairPlaces } from './WheelchairPlaces'
import { Wifi } from './Wifi'
import { useFeature } from '../../../../../lib/fetchers/useFeature'

const SimpleList = styled.div`

  > ul > li {
    // just an indicator that this is a rendering part
    border-left: 10px ${colors.linkBackgroundColorTransparent} solid;
    // light segmentation
    margin-bottom: 4px;
    padding-left: 4px;
  }
`

export const AccessibilityItems: FC<{ feature: AnyFeature }> = ({ feature }) => {
  const result = useFeature(feature?._id)
  const acAccessibility = result.accessibilityCloudFeature.data?.features[0]?.properties?.accessibility
    ?? isPlaceInfo(feature) ? feature.properties?.accessibility : { } ?? { }

  return (
    <SimpleList>
      <ul>
        <AvailableEquipment accessibility={acAccessibility} />
        <Entrances accessibility={acAccessibility} />
        <HasPatientLifter accessibility={acAccessibility} />
        <Restrooms accessibility={acAccessibility} />

        <WheelchairAccessibilityGrade accessibility={acAccessibility} />
        <WheelchairPlaces accessibility={acAccessibility} />
        <AccessibleWith accessibility={acAccessibility} />
        <PartiallyAccessibleWith accessibility={acAccessibility} />

        <Pathways accessibility={acAccessibility} />
        <PathwaysFromEntrance accessibility={acAccessibility} />
        <PathwaysInside accessibility={acAccessibility} />
        <Parking accessibility={acAccessibility} />
        <Surface accessibility={acAccessibility} />

        <ServiceContact accessibility={acAccessibility} />
        <Staff accessibility={acAccessibility} />

        <AnimalPolicy accessibility={acAccessibility} />
        <AppointmentPolicies accessibility={acAccessibility} />
        <QueueSystem accessibility={acAccessibility} />
        <SignageSystems accessibility={acAccessibility} />

        <Desks accessibility={acAccessibility} />
        <Tables accessibility={acAccessibility} />

        <AmbientNoiseLevel accessibility={acAccessibility} />
        <HasAirConditioning accessibility={acAccessibility} />
        <HasBackgroundMusic accessibility={acAccessibility} />
        <HasInductionLoop accessibility={acAccessibility} />
        <HasLowStimulusEnvironment accessibility={acAccessibility} />
        <HasSoundAbsorption accessibility={acAccessibility} />
        <Interactions accessibility={acAccessibility} />
        <IsQuiet accessibility={acAccessibility} />
        <IsWellLit accessibility={acAccessibility} />

        <Media accessibility={acAccessibility} />
        <Payment accessibility={acAccessibility} />

        <OffersActivitiesForPeopleWith accessibility={acAccessibility} />
        <OffersTreatmentWithoutLeavingWheelchair accessibility={acAccessibility} />

        <Rooms accessibility={acAccessibility} />
        <SmokingPolicy accessibility={acAccessibility} />

        <Wifi accessibility={acAccessibility} />
      </ul>
    </SimpleList>
  )
}
