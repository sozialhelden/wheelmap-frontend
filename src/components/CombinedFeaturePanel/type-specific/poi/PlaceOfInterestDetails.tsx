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
import { AccessibilityItems } from '../../components/AccessibilitySection/PlaceAccessibility/AccessibilityItems'

type Props = {
  feature: AnyFeature;
}

export default function PlaceOfInterestDetails({ feature }: Props) {
  const { baseFeatureUrl } = useContext(FeaturePanelContext)

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
      <FeatureNameHeader feature={feature}>
        {feature['@type'] === 'osm:Feature' && (
          <FeatureImage feature={feature} />
        )}
      </FeatureNameHeader>

      {/* TODO: Report button goes here. */}

      <FeatureAccessibility feature={feature}>
        <NextToiletDirections feature={feature} />
      </FeatureAccessibility>

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
