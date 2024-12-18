import { Callout } from "@blueprintjs/core";
import { bbox } from "@turf/turf";
import Link from "next/link";
import React, { useContext } from "react";
import { t } from "ttag";
import { FeatureImageUpload } from "~/components/CombinedFeaturePanel/components/FeatureImageUpload";
import {
  type AnyFeature,
  isPlaceInfo,
} from "../../../../lib/model/geo/AnyFeature";
import { AppStateLink } from "../../../App/AppStateLink";
import { useMap } from "../../../Map/useMap";
import { FeaturePanelContext } from "../../FeaturePanelContext";
import FeatureAccessibility from "../../components/AccessibilitySection/FeatureAccessibility";
import NextToiletDirections from "../../components/AccessibilitySection/NextToiletDirections";
import { AccessibilityItems } from "../../components/AccessibilitySection/PlaceAccessibility/AccessibilityItems";
import FeatureContext from "../../components/FeatureContext";
import { FeatureGallery } from "../../components/FeatureGallery";
import FeatureNameHeader from "../../components/FeatureNameHeader";
import FeaturesDebugJSON from "../../components/FeaturesDebugJSON";
import AddressMapsLinkItems from "../../components/IconButtonList/AddressMapsLinkItems";
import ExternalInfoAndEditPageLinks from "../../components/IconButtonList/ExternalInfoAndEditPageLinks";
import PhoneNumberLinks from "../../components/IconButtonList/PhoneNumberLinks";
import PlaceWebsiteLink from "../../components/IconButtonList/PlaceWebsiteLink";
import StyledIconButtonList from "../../components/IconButtonList/StyledIconButtonList";
import FeatureImage from "../../components/image/FeatureImage";

type Props = {
  feature: AnyFeature;
  activeImageId?: string;
  isUploadDialogOpen?: boolean;
  uploadStep?: string;
};

export default function PlaceOfInterestDetails({
  feature,
  activeImageId,
  isUploadDialogOpen,
  uploadStep,
}: Props) {
  const { baseFeatureUrl } = useContext(FeaturePanelContext);
  const map = useMap();

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
    );
  }

  return (
    <FeatureContext.Provider value={feature}>
      <FeatureNameHeader
        feature={feature}
        onHeaderClicked={() => {
          console.log(feature.geometry?.coordinates);
          const coordinates = feature.geometry?.coordinates;
          if (!coordinates) {
            return;
          }

          const cameraOptions = map?.map?.cameraForBounds(bbox(feature), {
            maxZoom: 19,
          });
          if (cameraOptions) {
            map?.map?.flyTo({ ...cameraOptions, duration: 1000, padding: 100 });
          }
          // map.current?.flyTo({ center: { ...feature.geometry?.coordinates } })
        }}
      >
        {feature["@type"] === "osm:Feature" && (
          <FeatureImage feature={feature} />
        )}
      </FeatureNameHeader>

      {/* TODO: Report button goes here. */}

      <FeatureAccessibility feature={feature}>
        <NextToiletDirections feature={feature} />
      </FeatureAccessibility>

      <FeatureGallery feature={feature} activeImageId={activeImageId} />
      <FeatureImageUpload
        feature={feature}
        isUploadDialogOpen={isUploadDialogOpen}
      />

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

      <AppStateLink href={`${baseFeatureUrl}/report`}>{t`Report`}</AppStateLink>
    </FeatureContext.Provider>
  );
}
