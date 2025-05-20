import React, { useContext } from "react";
import {
  type AnyFeature,
  isOSMFeature,
  isPlaceInfo,
} from "~/needs-refactoring/lib/model/geo/AnyFeature";
import { bbox } from "@turf/turf";
import { useMap } from "~/needs-refactoring/components/Map/useMap";
import FeatureImage from "~/needs-refactoring/components/CombinedFeaturePanel/components/image/FeatureImage";
import FeatureNameHeader from "~/needs-refactoring/components/CombinedFeaturePanel/components/FeatureNameHeader";
import AddressMapsLinkItems from "~/needs-refactoring/components/CombinedFeaturePanel/components/IconButtonList/AddressMapsLinkItems";
import PlaceWebsiteLink from "~/needs-refactoring/components/CombinedFeaturePanel/components/IconButtonList/PlaceWebsiteLink";
import PhoneNumberLinks from "~/needs-refactoring/components/CombinedFeaturePanel/components/IconButtonList/PhoneNumberLinks";
import ExternalInfoAndEditPageLinks from "~/needs-refactoring/components/CombinedFeaturePanel/components/IconButtonList/ExternalInfoAndEditPageLinks";
import StyledIconButtonList from "~/needs-refactoring/components/CombinedFeaturePanel/components/IconButtonList/StyledIconButtonList";
import { AccessibilityItems } from "~/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/PlaceAccessibility/AccessibilityItems";
import { FeatureGallery } from "~/needs-refactoring/components/CombinedFeaturePanel/components/FeatureGallery";
import { FeatureImageUpload } from "~/needs-refactoring/components/CombinedFeaturePanel/components/FeatureImageUpload";
import FeatureDescription from "~/modules/feature-panel/components/FeatureDescription";
import { useOsmTags } from "~/modules/feature-panel/hooks/useOsmTags";
import WheelchairSection from "~/modules/feature-panel/components/WheelchairSection";
import ToiletsSection from "~/modules/feature-panel/components/ToiletsSection";
import Section from "~/modules/feature-panel/components/Section";
import OsmInfoSection from "~/modules/feature-panel/components/OSMInfoSection";
import { FeaturePanelContext } from "~/needs-refactoring/components/CombinedFeaturePanel/FeaturePanelContext";
import { Separator } from "@radix-ui/themes";
import NextToiletDirections from "~/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/NextToiletDirections";
import LargeHeaderImage from "~/modules/feature-panel/components/LargeHeaderImage";
import PartOf from "~/modules/feature-panel/components/PartOf";

type Props = {
  features: AnyFeature[];
  activeImageId?: string;
  isUploadDialogOpen?: boolean;
};

const FeatureDetails = ({
  features,
  activeImageId,
  isUploadDialogOpen,
}: Props) => {
  const feature = features[0];
  const map = useMap();
  const context = useContext(FeaturePanelContext);
  const acAccessibility =
    context.features[0]?.feature?.acFeature?.properties.accessibility ?? null;
  console.log("acAccessibility", acAccessibility);
  const { nestedTags } = isOSMFeature(feature)
    ? useOsmTags(feature)
    : { nestedTags: [], topLevelKeys: new Set() };

  console.log("nestedTags", nestedTags);

  const generalDescription = nestedTags.find(
    (tag) => tag.key === "description",
  );
  const osmWheelchairInfo = nestedTags.find(
    (tag) => tag.key === "wheelchair_accessibility",
  );
  const osmToiletInfo = nestedTags.find((tag) => tag.key === "restrooms");
  const generalOSMInfo = nestedTags.filter(
    (tag) =>
      tag.key !== "wheelchair_accessibility" &&
      tag.key !== "restrooms" &&
      tag.key !== "description",
  );
  const surroundings = features?.length > 1 ? features.slice(1) : undefined;

  console.log("surroundings", surroundings);

  const handleHeaderClick = () => {
    console.log(feature.geometry?.coordinates);
    const coordinates = feature.geometry?.coordinates;
    if (!coordinates) {
      return;
    }

    const cameraOptions = map?.map?.cameraForBounds(bbox(feature), {
      maxZoom: 19,
    });
    if (cameraOptions) {
      map?.map?.flyTo({
        ...cameraOptions,
        duration: 1000,
        padding: 100,
      });
    }
    // map.current?.flyTo({ center: { ...feature.geometry?.coordinates } })
  };

  const sectionItems = [
    osmWheelchairInfo && (
      <WheelchairSection key="osm_wheelchair" tags={osmWheelchairInfo} />
    ),
    osmToiletInfo ? (
      <ToiletsSection key="osm_toilets" tags={osmToiletInfo} />
    ) : (
      // this component needs refactoring and should also be shown when there is toilet info but negative one
      <NextToiletDirections key="next_toilet_dir" feature={feature} />
    ),
    acAccessibility && (
      <AccessibilityItems key="ac_accessibility" feature={feature} />
    ),
    generalOSMInfo.length > 0 && (
      <OsmInfoSection key="osm_info" tags={generalOSMInfo} />
    ),
    <>
      <FeatureGallery
        key="feature_gallery"
        feature={feature}
        activeImageId={activeImageId}
      />
      <FeatureImageUpload
        key="feature_image_upload"
        feature={feature}
        isUploadDialogOpen={isUploadDialogOpen}
      />
    </>,
    <StyledIconButtonList key="styled_icon_button_list">
      <AddressMapsLinkItems feature={feature} />
      <PlaceWebsiteLink feature={feature} />
      <PhoneNumberLinks feature={feature} />
      {isPlaceInfo(feature) && (
        <ExternalInfoAndEditPageLinks
          key="external_info_links"
          feature={feature}
        />
      )}
    </StyledIconButtonList>,
    surroundings && <PartOf key="part_of" surroundings={surroundings} />,
  ];

  return (
    <>
      {feature && (
        <>
          <LargeHeaderImage>
            {/*TODO: add Logo component*/}
            {feature["@type"] === "osm:Feature" && (
              <FeatureImage feature={feature} />
            )}
          </LargeHeaderImage>

          <FeatureNameHeader
            feature={feature}
            size="big"
            onHeaderClicked={handleHeaderClick}
            marginBottom="1rem"
          />

          {generalDescription && (
            <FeatureDescription>{generalDescription.value}</FeatureDescription>
          )}

          {sectionItems.filter(Boolean).map((item) => (
            <React.Fragment key={Math.random().toString(36)}>
              <Separator orientation="horizontal" size="4" />
              <Section>{item}</Section>
            </React.Fragment>
          ))}
        </>
      )}
    </>
  );
};

export default FeatureDetails;
