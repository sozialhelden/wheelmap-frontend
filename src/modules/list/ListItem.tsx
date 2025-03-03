import { Flex } from "@radix-ui/themes";
import { useState } from "react";
import styled from "styled-components";
import { t } from "ttag";
import { AppStateLink } from "~/components/App/AppStateLink";
import WikidataEntityImage from "~/components/CombinedFeaturePanel/components/image/WikidataEntityImage";
import { useFeatureLabel } from "~/components/CombinedFeaturePanel/utils/useFeatureLabel";
import { useMapHighlight } from "~/components/Map/filter";
import { useMap } from "~/components/Map/useMap";
import { useCurrentLanguageTagStrings } from "~/lib/context/LanguageTagContext";
import { isOrHasAccessibleToilet } from "~/lib/model/accessibility/isOrHasAccessibleToilet";
import { isWheelchairAccessible } from "~/lib/model/accessibility/isWheelchairAccessible";
import type { AnyFeature } from "~/lib/model/geo/AnyFeature";
import type { OSMId } from "~/lib/typing/brands/osmIds";
import OpeningHoursValueListItem from "~/modules/list/OpeningHoursListItem";
import { FullyWheelchairAccessibleIcon } from "~/modules/needs/components/icons/mobility/FullyWheelchairAccessibleIcon";
import { NoDataIcon } from "~/modules/needs/components/icons/mobility/NoDataIcon";
import { NotWheelchairAccessibleIcon } from "~/modules/needs/components/icons/mobility/NotWheelchairAccessibleIcon";
import { PartiallyWheelchairAccessibleIcon } from "~/modules/needs/components/icons/mobility/PartiallyWheelchairAccessibleIcon";
import { FullyWheelchairAccessibleToiletIcon } from "~/modules/needs/components/icons/toilets/FullyWheelchairAccessibleToiletIcon";

const Container = styled.div`
    display: grid;
    grid-template-columns: auto max-content;
    box-sizing: border-box;
    gap: 1rem;
    width: 100%;
    position: relative;
    padding: var(--space-5) var(--space-5);
    &:hover {
        background-color: var(--accent-2);
    }
`;
const TextContainer = styled.div`
    
  
`;
const WikidataImage = styled(WikidataEntityImage)`
    height: 3.75rem;
    width: 3.75rem;
    object-fit: cover;
    border-radius: var(--radius-3)
`;
const PlaceName = styled(AppStateLink)`
    font-size: 1.1rem;
    word-break: break-word;
    &::before{
        position: absolute;
        inset: 0;
        content: "";
        
    }
    text-decoration: none !important;
    color: var(--gray-12) !important;
    
    
`;
const Category = styled.p`
    font-size: .9rem;
    color: var(--gray-10);
`;

export function ListItem({ feature }: { feature: AnyFeature }) {
  const languageTags = useCurrentLanguageTagStrings();

  const { placeName, categoryName, ariaLabel } = useFeatureLabel({
    feature,
    languageTags,
  });

  const wheelchair = isWheelchairAccessible(feature);
  const toilet = isOrHasAccessibleToilet(feature);

  const pathname =
    feature["@type"] === "ac:PlaceInfo"
      ? `/ac:PlaceInfo/${feature._id}`
      : `/amenities/${feature._id.replace("/", ":")}`;

  const getLatLon = () => {
    if (feature.centroid) {
      const [lon, lat] = feature.centroid.coordinates;
      return { lat, lon };
    }
    if (feature.geometry && feature.geometry.type === "Point") {
      const [lon, lat] = feature.geometry.coordinates;
      return { lat, lon };
    }
    return { lat: 0, lon: 0 };
  };

  const { lat, lon } = getLatLon();

  const { map } = useMap();

  const [highlightedFeatureId, setHighlightedFeatureId] = useState<string>();
  useMapHighlight(highlightedFeatureId as OSMId);

  return (
    <Container
      onMouseEnter={() =>
        setHighlightedFeatureId(`osm:amenities/${feature._id}`)
      }
      onMouseLeave={() => setHighlightedFeatureId(undefined)}
    >
      <TextContainer>
        <PlaceName
          href={{
            pathname,
            query: { zoom: 17, lat, lon },
          }}
          onClick={() => map?.jumpTo({ center: [lon, lat], zoom: 17 })}
          aria-label={t`Open place ${ariaLabel}`}
        >
          {placeName}
        </PlaceName>
        <Category>{categoryName}</Category>
        {feature.properties.opening_hours && (
          <OpeningHoursValueListItem
            osmFeature={feature}
            value={feature.properties.opening_hours}
            tagKey={"opening_hours"}
          />
        )}
        <Flex gap="2">
          {wheelchair === "yes" && <FullyWheelchairAccessibleIcon />}
          {wheelchair === "limited" && <PartiallyWheelchairAccessibleIcon />}
          {wheelchair === "no" && <NotWheelchairAccessibleIcon />}
          {wheelchair === "unknown" && <NoDataIcon />}
          {toilet === "yes" && <FullyWheelchairAccessibleToiletIcon />}
        </Flex>
      </TextContainer>
      <WikidataImage feature={feature} verb="P18" />
    </Container>
  );
}
