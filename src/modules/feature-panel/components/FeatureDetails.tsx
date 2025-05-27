import React, { useContext } from "react";
import {
  type AnyFeature,
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
import OsmInfoSection from "~/modules/feature-panel/components/OSMInfoSection";
import { FeaturePanelContext } from "~/needs-refactoring/components/CombinedFeaturePanel/FeaturePanelContext";

import LargeHeaderImage from "~/modules/feature-panel/components/LargeHeaderImage";
import PartOf from "~/modules/feature-panel/components/PartOf";
import { useNextToilet } from "~/modules/feature-panel/hooks/useNextToilet";
import styled from "styled-components";
import { Flex } from "@radix-ui/themes";

type Props = {
  features: AnyFeature[];
  activeImageId?: string;
  isUploadDialogOpen?: boolean;
};

const SectionsContainer = styled.div`
    > div {
        padding: var(--space-4);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        border-bottom: 1px solid var(--gray-5);
    }
    > div:last-child {
        border-bottom: none;
    }
    > div.empty {
        border-bottom: none;
    }
    `;

const FeatureDetails = ({
  features,
  activeImageId,
  isUploadDialogOpen,
}: Props) => {
  const feature = features[0];

  const map = useMap();
  const context = useContext(FeaturePanelContext);
  const { nestedTags } = useOsmTags(feature);
  const { nextToilet, isLoadingNextToilet } = useNextToilet(feature);
  const acAccessibility =
    context.features[0]?.feature?.acFeature?.properties.accessibility ?? null;
  const surroundings = features?.length > 1 ? features.slice(1) : undefined;

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

  const handleHeaderClick = () => {
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

  return (
    <>
      {feature && (
        <Flex direction="column">
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
            mb="1rem"
          />

          <SectionsContainer style={{ order: 3 }}>
            {generalDescription && (
              <FeatureDescription>
                {generalDescription.value}
              </FeatureDescription>
            )}
            {osmWheelchairInfo && (
              <div>
                <WheelchairSection
                  key="osm_wheelchair"
                  tags={osmWheelchairInfo}
                />
              </div>
            )}
            {(osmToiletInfo || nextToilet) && (
              <div>
                <ToiletsSection
                  key="osm_toilets"
                  tags={osmToiletInfo}
                  nextToilet={nextToilet}
                  isLoading={isLoadingNextToilet}
                />
              </div>
            )}
            {acAccessibility && (
              <div>
                <AccessibilityItems key="ac_accessibility" feature={feature} />
              </div>
            )}

            {generalOSMInfo.length > 0 && (
              <div>
                <OsmInfoSection key="osm_info" tags={generalOSMInfo} />
              </div>
            )}
            <div>
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
            </div>
            <div>
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
              </StyledIconButtonList>
            </div>
            {surroundings && (
              <div>
                <PartOf key="part_of" surroundings={surroundings} />
              </div>
            )}
          </SectionsContainer>
        </Flex>
      )}
    </>
  );
};

export default FeatureDetails;
