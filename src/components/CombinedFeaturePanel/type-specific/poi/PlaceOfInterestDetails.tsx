import { Callout } from '@blueprintjs/core'
import { t } from 'ttag'
import Link from 'next/link'
import React, { useContext } from 'react'
import { AnyFeature, isPlaceInfo } from '../../../../lib/model/geo/AnyFeature'
import FeatureAccessibility from '../../components/AccessibilitySection/FeatureAccessibility'
import FeatureContext from '../../components/FeatureContext'
import FeatureNameHeader from '../../components/FeatureNameHeader'
import AddressMapsLinkItems from '../../components/IconButtonList/AddressMapsLinkItems'
import ExternalInfoAndEditPageLinks from '../../components/IconButtonList/ExternalInfoAndEditPageLinks'
import PhoneNumberLinks from '../../components/IconButtonList/PhoneNumberLinks'
import PlaceWebsiteLink from '../../components/IconButtonList/PlaceWebsiteLink'
import StyledIconButtonList from '../../components/IconButtonList/StyledIconButtonList'
import FeatureImage from '../../components/image/FeatureImage'
import FeaturesDebugJSON from '../../components/FeaturesDebugJSON'
import NextToiletDirections from '../../components/AccessibilitySection/NextToiletDirections'
import { AppStateLink } from '../../../App/AppStateLink'
import { FeaturePanelContext } from '../../FeaturePanelContext'
import { useMap } from '../../../Map/useMap'
import { AccessibilityItems } from '../../components/AccessibilitySection/PlaceAccessibility/AccessibilityItems'
import { FeatureGallery } from '../../components/FeatureGallery'

type Props = {
  feature: AnyFeature;
  focusImage?: string;
}

export default function PlaceOfInterestDetails({ feature, focusImage }: Props) {
  const { baseFeatureUrl } = useContext(FeaturePanelContext)
  const map = useMap()

  if (!feature.properties) {
    return (
      <Callout>
        <h2>{t`This place has no known properties.`}</h2>
        <p>
          <Link href={`https://openstreetmap.org/${feature._id}`}>
            {t`View on OpenStreetMap`}
          </Link>
        </p>
        <FeaturesDebugJSON features={[feature]} />
      </Callout>
    )
  }

  return (
    <FeatureContext.Provider value={feature}>
      <FeatureNameHeader
        feature={feature}
        onHeaderClicked={() => {
          console.log(feature.geometry?.coordinates)
          const coordinates = feature.geometry?.coordinates
          if (!coordinates) {
            return
          }
          map?.map?.flyTo({ center: { lat: coordinates[1], lon: coordinates[0] } })
          // map.current?.flyTo({ center: { ...feature.geometry?.coordinates } })
        }}
      >
        {feature['@type'] === 'osm:Feature' && (
          <FeatureImage feature={feature} />
        )}
      </FeatureNameHeader>

      {/* TODO: Report button goes here. */}

      <FeatureAccessibility feature={feature}>
        <NextToiletDirections feature={feature} />
      </FeatureAccessibility>

      <FeatureGallery feature={feature} focusImage={focusImage} />

      <StyledIconButtonList>
        <AccessibilityItems feature={feature} />
        <AddressMapsLinkItems feature={feature} />
        <PlaceWebsiteLink feature={feature} />
        <PhoneNumberLinks feature={feature} />
        {isPlaceInfo(feature) && (
          <ExternalInfoAndEditPageLinks feature={feature} />
        )}
        {/*
        <ShareButtons {...props} />
        {!props.equipmentInfoId && <ReportIssueButton {...props} />} */}
      </StyledIconButtonList>

      <AppStateLink href={`${baseFeatureUrl}/report`}>
        {t`Report`}
      </AppStateLink>
    </FeatureContext.Provider>
  )
}
