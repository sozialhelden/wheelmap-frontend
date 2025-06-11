import { bbox } from "@turf/turf";
import React, { useContext } from "react";
import FeatureDescription from "~/modules/edit/components/FeatureDescription";
import OsmInfoSection from "~/modules/edit/components/OSMInfoSection";
import ToiletsSection from "~/modules/edit/components/ToiletsSection";
import WheelchairSection from "~/modules/edit/components/WheelchairSection";
import { useOsmTags } from "~/modules/edit/hooks/useOsmTags";
import { FeaturePanelContext } from "~/needs-refactoring/components/CombinedFeaturePanel/FeaturePanelContext";
import { AccessibilityItems } from "~/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/PlaceAccessibility/AccessibilityItems";
import { FeatureGallery } from "~/needs-refactoring/components/CombinedFeaturePanel/components/FeatureGallery";
import { FeatureImageUpload } from "~/needs-refactoring/components/CombinedFeaturePanel/components/FeatureImageUpload";
import FeatureNameHeader from "~/needs-refactoring/components/CombinedFeaturePanel/components/FeatureNameHeader";
import AddressMapsLinkItems from "~/needs-refactoring/components/CombinedFeaturePanel/components/IconButtonList/AddressMapsLinkItems";
import ExternalInfoAndEditPageLinks from "~/needs-refactoring/components/CombinedFeaturePanel/components/IconButtonList/ExternalInfoAndEditPageLinks";
import PhoneNumberLinks from "~/needs-refactoring/components/CombinedFeaturePanel/components/IconButtonList/PhoneNumberLinks";
import PlaceWebsiteLink from "~/needs-refactoring/components/CombinedFeaturePanel/components/IconButtonList/PlaceWebsiteLink";
import StyledIconButtonList from "~/needs-refactoring/components/CombinedFeaturePanel/components/IconButtonList/StyledIconButtonList";
import FeatureImage from "~/needs-refactoring/components/CombinedFeaturePanel/components/image/FeatureImage";
import { useMap } from "~/needs-refactoring/components/Map/useMap";
import {
  type AnyFeature,
  isPlaceInfo,
} from "~/needs-refactoring/lib/model/geo/AnyFeature";

import { Flex } from "@radix-ui/themes";
import styled from "styled-components";
import { breakpoints } from "~/hooks/useBreakpoints";
import HeaderImageSection from "~/modules/edit/components/HeaderImageSection";
import PartOf from "~/modules/edit/components/PartOf";
import { useNextAccessibleToilet } from "~/modules/edit/hooks/useNextAccessibleToilet";

type Props = {
  features: AnyFeature[];
  activeImageId?: string;
  isUploadDialogOpen?: boolean;
};

const Section = styled(Flex)`
    flex-direction: column;
    padding: var(--space-4);
    gap: var(--space-3);
    border-bottom: 1px solid var(--gray-5);
`;

const HeaderSection = styled(Section)<{
  $orderDesktop?: number;
  $orderMobile?: number;
}>`
    order: ${(props) => props.$orderMobile};
    @media (min-width: ${breakpoints.xs}px) {
        order: ${(props) => props.$orderDesktop};
    }
`;

const SectionsContainer = styled(Flex)<{
  $orderDesktop?: number;
  $orderMobile?: number;
}>`
    //display: flex;
    flex-direction: column;
    order: ${(props) => props.$orderMobile};
    @media (min-width: ${breakpoints.xs}px) {
        order: ${(props) => props.$orderDesktop};
    }
    ${Section}:last-child {
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
  const { nextAccessibleToilet, isLoadingNextToilet } =
    useNextAccessibleToilet(feature);
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
          <HeaderImageSection $orderDesktop={1} $orderMobile={3}>
            {/*TODO: add Logo component*/}
            {feature["@type"] === "osm:Feature" && (
              <FeatureImage feature={feature} />
            )}
          </HeaderImageSection>

          <HeaderSection $orderDesktop={2} $orderMobile={1}>
            <FeatureNameHeader
              feature={feature}
              size="big"
              onHeaderClicked={handleHeaderClick}
              mb="1rem"
            />
            {generalDescription && (
              <FeatureDescription>
                {generalDescription.value}
              </FeatureDescription>
            )}
          </HeaderSection>

          <SectionsContainer $orderDesktop={3} $orderMobile={2}>
            {osmWheelchairInfo && (
              <Section>
                <WheelchairSection
                  key="osm_wheelchair"
                  tags={osmWheelchairInfo}
                  feature={feature}
                />
              </Section>
            )}
            {(osmToiletInfo || nextAccessibleToilet) && (
              <Section>
                <ToiletsSection
                  key="osm_toilets"
                  tags={osmToiletInfo}
                  nextToilet={nextAccessibleToilet}
                  isLoading={isLoadingNextToilet}
                  feature={feature}
                />
              </Section>
            )}
            {acAccessibility && (
              <Section>
                <AccessibilityItems key="ac_accessibility" feature={feature} />
              </Section>
            )}

            {generalOSMInfo.length > 0 && (
              <Section>
                <OsmInfoSection key="osm_info" tags={generalOSMInfo} />
              </Section>
            )}
            <Section>
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
            </Section>
            <Section>
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
            </Section>
            {surroundings && (
              <Section>
                <PartOf key="part_of" surroundings={surroundings} />
              </Section>
            )}
          </SectionsContainer>
        </Flex>
      )}
    </>
  );
};

export default FeatureDetails;
