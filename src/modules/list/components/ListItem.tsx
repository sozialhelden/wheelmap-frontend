import { Flex, Text } from "@radix-ui/themes";
import { T } from "@transifex/react";
import { DateTime } from "luxon";
import { useMemo, useState } from "react";
import * as React from "react";
import styled from "styled-components";
import { useOpeningHours } from "~/hooks/useOpeningHours";
import { useWikidataImage } from "~/hooks/useWikidata";
import type { RenderedFeature } from "~/layouts/DefaultLayout";
import { AppStateAwareLink } from "~/modules/app-state/components/AppStateAwareLink";
import { FullyWheelchairAccessibleIcon } from "~/modules/needs/components/icons/mobility/FullyWheelchairAccessibleIcon";
import { NoDataIcon } from "~/modules/needs/components/icons/mobility/NoDataIcon";
import { NotWheelchairAccessibleIcon } from "~/modules/needs/components/icons/mobility/NotWheelchairAccessibleIcon";
import { PartiallyWheelchairAccessibleIcon } from "~/modules/needs/components/icons/mobility/PartiallyWheelchairAccessibleIcon";
import { FullyWheelchairAccessibleToiletIcon } from "~/modules/needs/components/icons/toilets/FullyWheelchairAccessibleToiletIcon";
import { useFeatureLabel } from "~/needs-refactoring/components/CombinedFeaturePanel/utils/useFeatureLabel";
import { useMapHighlight } from "~/needs-refactoring/components/Map/filter/useMapHighlight";
import { isOrHasAccessibleToilet } from "~/needs-refactoring/lib/model/accessibility/isOrHasAccessibleToilet";
import { isWheelchairAccessible } from "~/needs-refactoring/lib/model/accessibility/isWheelchairAccessible";
import type { AnyFeature } from "~/needs-refactoring/lib/model/geo/AnyFeature";
import type { OSMId } from "~/needs-refactoring/lib/typing/brands/osmIds";
import { getFeatureUrl } from "~/utils/url";

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
const WikidataImage = styled.img`
    height: 3.75rem;
    width: 3.75rem;
    object-fit: cover;
    border-radius: var(--radius-3)
`;
const PlaceName = styled(AppStateAwareLink)`
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

export function ListItem({ feature }: { feature: RenderedFeature }) {
  const { placeName, categoryName } = useFeatureLabel({
    feature: feature as AnyFeature,
  });

  const url = useMemo(() => getFeatureUrl(feature).toString(), [feature]);

  const wheelchair = isWheelchairAccessible(feature as AnyFeature);
  const toilet = isOrHasAccessibleToilet(feature as AnyFeature);

  const { data: wikidataImageUrl } = useWikidataImage({
    properties: feature.properties ?? {},
    width: 200,
  });

  const openingHours = useOpeningHours(feature);
  const isOpen = openingHours?.getState();
  const nextOpeningChange =
    openingHours && DateTime.fromJSDate(openingHours.getNextChange() as Date);
  const nextChangeIsToday =
    nextOpeningChange && DateTime.local().hasSame(nextOpeningChange, "day");

  const [highlightedFeatureId, setHighlightedFeatureId] = useState<string>();
  useMapHighlight(highlightedFeatureId as OSMId);

  return (
    <Container
      onMouseEnter={() =>
        setHighlightedFeatureId(`osm:amenities/${feature._id}`)
      }
      onMouseLeave={() => setHighlightedFeatureId(undefined)}
    >
      <div>
        {/*TODO: make sure the place opens right next to the list */}
        {/*TODO: add padding to map again, scroll place into map view when not in map-view */}
        <PlaceName href={url}>{placeName}</PlaceName>
        <Category>{categoryName}</Category>

        {nextOpeningChange && (
          <Text size="2">
            {isOpen && (
              <T
                _str="{status} until {date}"
                status={
                  <Text color="green">
                    <T _str="Probably opened" />
                  </Text>
                }
                date={<Text>{nextOpeningChange.toFormat("HH:mm")}</Text>}
              />
            )}
            {!isOpen && nextChangeIsToday && (
              <T
                _str="{status} - opens at {date}"
                status={
                  <Text color="red">
                    <T _str="Probably closed" />
                  </Text>
                }
                date={nextOpeningChange.toFormat("HH:mm")}
              />
            )}
            {!isOpen && !nextChangeIsToday && (
              <T
                _str="{status} - opens {date}"
                status={
                  <Text color="red">
                    <T _str="Probably closed" />
                  </Text>
                }
                date={nextOpeningChange.toFormat("ccc HH:mm")}
              />
            )}
          </Text>
        )}

        <Flex gap="2">
          {/*TODO: put this into the needs modules*/}
          {wheelchair === "yes" && <FullyWheelchairAccessibleIcon />}
          {wheelchair === "limited" && <PartiallyWheelchairAccessibleIcon />}
          {wheelchair === "no" && <NotWheelchairAccessibleIcon />}
          {wheelchair === "unknown" && <NoDataIcon />}
          {toilet === "yes" && <FullyWheelchairAccessibleToiletIcon />}
        </Flex>
      </div>
      {wikidataImageUrl && <WikidataImage src={wikidataImageUrl} />}
    </Container>
  );
}
