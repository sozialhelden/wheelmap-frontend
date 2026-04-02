import React, { useContext, useRef } from "react";
import { useMap } from "~/modules/map/hooks/useMap";
import { FeaturePanelContext } from "~/needs-refactoring/components/CombinedFeaturePanel/FeaturePanelContext";
import { AccessibilityItems } from "~/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/PlaceAccessibility/AccessibilityItems";
import { FeatureGallery } from "~/needs-refactoring/components/CombinedFeaturePanel/components/FeatureGallery";
import { FeatureImageUpload } from "~/needs-refactoring/components/CombinedFeaturePanel/components/FeatureImageUpload";
import AddressMapsLinkItems from "~/needs-refactoring/components/CombinedFeaturePanel/components/IconButtonList/AddressMapsLinkItems";
import ExternalInfoAndEditPageLinks from "~/needs-refactoring/components/CombinedFeaturePanel/components/IconButtonList/ExternalInfoAndEditPageLinks";
import PhoneNumberLinks from "~/needs-refactoring/components/CombinedFeaturePanel/components/IconButtonList/PhoneNumberLinks";
import PlaceWebsiteLink from "~/needs-refactoring/components/CombinedFeaturePanel/components/IconButtonList/PlaceWebsiteLink";
import StyledIconButtonList from "~/needs-refactoring/components/CombinedFeaturePanel/components/IconButtonList/StyledIconButtonList";
import { useWikidataEntityImage } from "~/needs-refactoring/components/CombinedFeaturePanel/components/image/WikidataEntityImage";
import WikipediaLink from "~/needs-refactoring/components/CombinedFeaturePanel/components/WikipediaLink";
import {
  type AnyFeature,
  isPlaceInfo,
} from "~/needs-refactoring/lib/model/geo/AnyFeature";
import type OSMFeature from "~/needs-refactoring/lib/model/osm/OSMFeature";
import { useOsmTags } from "~/needs-refactoring/modules/edit/hooks/useOsmTags";
import FeatureDescription from "~/needs-refactoring/modules/feature-panel/components/FeatureDescription";
import OsmInfoSection from "~/needs-refactoring/modules/feature-panel/components/OSMInfoSection";
import ToiletsSection from "~/needs-refactoring/modules/feature-panel/components/ToiletsSection";
import WheelchairSection from "~/needs-refactoring/modules/feature-panel/components/WheelchairSection";

import { Flex, Heading, Spinner, VisuallyHidden } from "@radix-ui/themes";
import { t } from "@transifex/native";
import styled from "styled-components";
import FeatureHeader from "~/needs-refactoring/components/CombinedFeaturePanel/components/FeatureHeader";
import { useNextAccessibleToilet } from "~/needs-refactoring/modules/edit/hooks/useNextAccessibleToilet";
import HeaderImageSection from "~/needs-refactoring/modules/feature-panel/components/HeaderImageSection";
import PartOf from "~/needs-refactoring/modules/feature-panel/components/PartOf";
import FeatureImage from "~/needs-refactoring/components/CombinedFeaturePanel/components/image/FeatureImage";
import { focusMapOnFeature } from "~/utils/focus-map-on-feature";

type Props = {
  features: AnyFeature[];
  isLoading: boolean | undefined;
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
  $hasImageSection?: boolean;
}>`
    padding-top: ${(props) => (props.$hasImageSection ? "var(--space-1)" : "var(--space-5)")};
    @media (min-width: 769px) {
        padding-top: ${(props) => (props.$hasImageSection ? "var(--space-1)" : "calc(var(--topbar-height) + var(--space-5))")};
    }
`;

const SectionsContainer = styled(Flex)`
    flex-direction: column;
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

  const osmFeature = feature?.["@type"] === "osm:Feature" ? feature : null;

  const {
    isLoading: isImageLoading,
    imageUrl,
    hasImage,
  } = useWikidataEntityImage({
    feature: osmFeature ?? ({ properties: {} } as unknown as OSMFeature),
    verb: "P18",
  });

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
    focusMapOnFeature(map.map, { feature });
  };

  const headingRef = useRef<HTMLHeadingElement>(null);
  // useEffect(() => {
  //   if (headingRef.current) headingRef.current.focus();
  // }, [placeName]);

  return (
    <>
      {feature && (
        <Flex direction="column">
          {(isImageLoading || hasImage) && (
            <HeaderImageSection data-testid="header-image-section">
              {isImageLoading ? (
                <Spinner size="3" />
              ) : (
                imageUrl &&
                osmFeature && (
                  <WikipediaLink feature={osmFeature}>
                    <FeatureImage imageUrl={imageUrl} />
                  </WikipediaLink>
                )
              )}
            </HeaderImageSection>
          )}

          <HeaderSection $hasImageSection={isImageLoading || hasImage}>
            <FeatureHeader
              ref={headingRef}
              level="h1"
              feature={feature}
              onIconClicked={handleHeaderClick}
            />

            {generalDescription && (
              <div>
                <VisuallyHidden>
                  <Heading as="h2">{t("Description")}</Heading>
                </VisuallyHidden>
                <FeatureDescription>
                  {generalDescription.value}
                </FeatureDescription>
              </div>
            )}
          </HeaderSection>

          <SectionsContainer>
            <Section>
              <VisuallyHidden>
                <Heading as="h2">{t("Wheelchair section")}</Heading>
              </VisuallyHidden>
              <WheelchairSection
                key="osm_wheelchair"
                tags={osmWheelchairInfo}
                feature={feature}
              />
            </Section>
            {(osmWheelchairInfo || nextAccessibleToilet) && (
              <Section>
                <VisuallyHidden>
                  <Heading as="h2">{t("Toilet section")}</Heading>
                </VisuallyHidden>
                <ToiletsSection
                  key="osm_toilets"
                  tags={osmToiletInfo}
                  // if there is wheelchair info but no toilet info or no accessible toilet,
                  // we show the next accessible toilet
                  nextToilet={nextAccessibleToilet}
                  isLoading={isLoadingNextToilet}
                  feature={feature}
                />
              </Section>
            )}
            <VisuallyHidden>
              <Heading as="h2">
                {t("Further Information about this place")}
              </Heading>
            </VisuallyHidden>

            {acAccessibility && (
              <Section data-testid="ac-section">
                <AccessibilityItems key="ac_accessibility" feature={feature} />
              </Section>
            )}

            {generalOSMInfo.length > 0 && (
              <Section data-testid="general-osm-section">
                <OsmInfoSection key="osm_info" tags={generalOSMInfo} />
              </Section>
            )}

            <Section>
              <VisuallyHidden>
                <Heading as="h2">
                  {t("Image Gallery and Upload of new Images")}
                </Heading>
              </VisuallyHidden>
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
              <VisuallyHidden>
                <Heading as="h2">{t("Further links")}</Heading>
              </VisuallyHidden>
              <StyledIconButtonList
                key="styled_icon_button_list"
                data-testid="styled-icon-button-list"
              >
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
