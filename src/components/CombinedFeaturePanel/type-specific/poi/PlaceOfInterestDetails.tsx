import { Callout } from "@blueprintjs/core";
import { bbox } from "@turf/turf";
import type { BBox } from "geojson";
import React, { useContext } from "react";
import { t } from "ttag";
import { FeatureImageUpload } from "~/components/CombinedFeaturePanel/components/FeatureImageUpload";
import {
  type AnyFeature,
  isPlaceInfo,
} from "../../../../lib/model/geo/AnyFeature";
import { useMap } from "../../../Map/useMap";
import SvgFlag from "../../../icons/actions/Flag";
import { FeaturePanelContext } from "../../FeaturePanelContext";
import FeatureAccessibility from "../../components/AccessibilitySection/FeatureAccessibility";
import NextToiletDirections from "../../components/AccessibilitySection/NextToiletDirections";
import { AccessibilityItems } from "../../components/AccessibilitySection/PlaceAccessibility/AccessibilityItems";
import FeatureContext from "../../components/FeatureContext";
import { FeatureGallery } from "../../components/FeatureGallery";
import FeatureNameHeader from "../../components/FeatureNameHeader";
import FeaturesDebugJSON from "../../components/FeaturesDebugJSON";
import AddressMapsLinkItems from "../../components/IconButtonList/AddressMapsLinkItems";
import { CaptionedIconButton } from "../../components/IconButtonList/CaptionedIconButton";
import ExternalInfoAndEditPageLinks from "../../components/IconButtonList/ExternalInfoAndEditPageLinks";
import PhoneNumberLinks from "../../components/IconButtonList/PhoneNumberLinks";
import PlaceWebsiteLink from "../../components/IconButtonList/PlaceWebsiteLink";
import StyledIconButtonList from "../../components/IconButtonList/StyledIconButtonList";
import FeatureImage from "../../components/image/FeatureImage";

type Props = {
  feature: AnyFeature;
  activeImageId?: string;
  isUploadDialogOpen?: boolean;
};

function is2DBBox(bbox: BBox): bbox is [number, number, number, number] {
  return bbox.length === 4;
}

export default function PlaceOfInterestDetails({
  feature,
  activeImageId,
  isUploadDialogOpen,
}: Props) {
  const { baseFeatureUrl } = useContext(FeaturePanelContext);
  const map = useMap();

  const flyToFeature = React.useCallback(() => {
    if ("type" in feature) {
      const featureBbox = bbox(feature);
      if (!is2DBBox(featureBbox)) {
        return;
      }
      const cameraOptions = map?.map?.cameraForBounds(featureBbox, {
        maxZoom: 19,
      });
      if (cameraOptions) {
        map?.map?.flyTo({
          ...cameraOptions,
          duration: 1000,
          padding: 100,
        });
      }
    }
  }, [feature, map]);

  if (!feature.properties) {
    return (
      <Callout>
        <h2>{t`This place has no known properties.`}</h2>
        <FeaturesDebugJSON features={[feature]} />
      </Callout>
    );
  }

  return (
    <FeatureContext.Provider value={feature}>
      <FeatureNameHeader feature={feature} onHeaderClicked={flyToFeature}>
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
        <CaptionedIconButton
          href={`${baseFeatureUrl}/report`}
          icon={<SvgFlag />}
          caption={t`Report`}
        />
      </StyledIconButtonList>
    </FeatureContext.Provider>
  );
}
