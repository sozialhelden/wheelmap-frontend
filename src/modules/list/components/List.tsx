import { Callout, Flex, Spinner, Text } from "@radix-ui/themes";
import { T } from "@transifex/react";
import { CircleAlert } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { SecondaryButton } from "~/components/button/SecondaryButton";
import type { RenderedFeature } from "~/layouts/DefaultLayout";
import { ListItem } from "~/modules/list/components/ListItem";
import { useRenderedFeatures } from "~/modules/map/hooks/useRenderedFeatures";
import { getExternalSources } from "~/modules/map/utils/sources";

const StyledList = styled.ul`
    box-sizing: border-box;
    margin: 0 calc(var(--space-3) * -1) 0 calc(var(--space-3) * -1);

    li {
        border-bottom: 2px solid var(--gray-3);
        &:last-child {
            border-bottom: none;
        }
    }
`;

const perPage = 10;

export function List() {
  const { features, isLoading, zoomLevelTooLow } = useRenderedFeatures();
  const [page, setPage] = useState(1);

  const [loadingCount, setLoadingCount] = useState(0);
  const isFirstLoad = loadingCount <= 1 && isLoading;

  const hasMore = useMemo(() => {
    return features.length > page * perPage;
  }, [features, page]);

  // TODO: sort features by distance from the center of the map or by the current
  //  location of the user. this is probably very hard to do, as queryRenderedFeatures
  //  returns the coordinates of the resulting tile instead of lat/lng
  const renderedFeatures: RenderedFeature[] = useMemo(
    () =>
      features.slice(0, page * perPage).map((feature) => {
        // TODO: this is a workaround to ensure that the feature has an _id and @type in order
        //  to use existing components. ideally, this should be either handled in the backend
        //  or not be necessary at all.
        return {
          ...feature,
          _id: feature.properties?.id,
          "@type":
            feature.layer?.id &&
            getExternalSources(feature.layer.id)?.[0]["@type"],
        };
      }),
    [features, page],
  );

  useEffect(() => {
    console.log("re-render");
  }, [features]);

  useEffect(() => {
    if (loadingCount > 1) {
      return;
    }
    if (isLoading) {
      setLoadingCount(loadingCount + 1);
    }
  }, [isLoading]);

  return (
    <>
      {isFirstLoad && (
        <Flex justify="center" mt="3">
          <Spinner size="3" />
        </Flex>
      )}
      {!isFirstLoad && zoomLevelTooLow && (
        <Callout.Root>
          <Callout.Icon>
            <CircleAlert aria-hidden />
          </Callout.Icon>
          <Callout.Text>
            <T _str="Please zoom in to see a list of places here" />
          </Callout.Text>
        </Callout.Root>
      )}
      {!isFirstLoad && !zoomLevelTooLow && (
        <>
          <Flex asChild justify="center" mt="2" mb="4">
            <Text size="2" weight="medium">
              <T _str="{count} places found" count={features.length} />
            </Text>
          </Flex>
          {features.length === 0 && (
            <Callout.Root>
              <Callout.Icon>
                <CircleAlert aria-hidden />
              </Callout.Icon>
              <Callout.Text>
                <T _str="No places were found. Try to zoom out or move the map." />
              </Callout.Text>
            </Callout.Root>
          )}
          <StyledList>
            {renderedFeatures.map((feature) => (
              <li key={feature._id}>
                <ListItem feature={feature} />
              </li>
            ))}
          </StyledList>
          {hasMore && (
            <Flex justify="center" mt="3" mb="3">
              <SecondaryButton onClick={() => setPage(page + 1)}>
                <T _str="More" />
              </SecondaryButton>
            </Flex>
          )}
        </>
      )}
    </>
  );
}
