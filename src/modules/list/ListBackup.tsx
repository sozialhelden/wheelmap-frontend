import { Spinner } from "@radix-ui/themes";
import React, { useEffect, useMemo, useState } from "react";
import type { LngLatBounds } from "react-map-gl/mapbox";
import styled from "styled-components";
import useSWR from "swr";
import { useMap } from "~/components/Map/useMap";
import { genericFetcher } from "~/lib/fetchers/useFeatures/fetchers";
import type { OSMFeatureCollection } from "~/lib/model/geo/AnyFeature";
import { useCategoryFilter } from "~/modules/categories/contexts/CategoryFilterContext";
import { ListItem } from "~/modules/list/ListItem";
import { useOsmApiFilterQuery } from "../osm-api/hooks/useOsmApiFilterQuery";
import { useOsmApiUrl } from "../osm-api/hooks/useOsmApiUrl";

const StyledList = styled.ul`
    box-sizing: border-box;
    margin: 0 calc(var(--space-3) * -1) calc(var(--space-3) * -1) calc(var(--space-3) * -1);

    li {
        border-bottom: 2px solid var(--gray-3);
        &:last-child {
            border-bottom: none;
        }
    }
`;

export function ListBackup() {
  const { isFilteringActive } = useCategoryFilter();

  /* save bbox */
  const { map } = useMap();
  window.map = map;
  const [boundingBox, setBoundingBox] = useState<LngLatBounds>();
  useEffect(() => {
    if (isFilteringActive) {
      setBoundingBox(map?.getBounds() || undefined);
    } else {
      setBoundingBox(undefined);
    }
  }, [isFilteringActive, map]);

  /* fetch data */
  const filterParams = useOsmApiFilterQuery();
  const url = useMemo(() => {
    return useOsmApiUrl({
      path: "amenities",
      params: {
        ...filterParams,
        limit: "30",
      },
      suffix: `&bbox=${boundingBox?.toArray().join(",")}`,
      format: "json",
    });
  }, [boundingBox, filterParams]);
  const { error, data, isLoading, isValidating } = useSWR(
    boundingBox && [url],
    genericFetcher<OSMFeatureCollection>,
  );

  /* filter map, must be in a different place, because it
  will not be triggered when this component gets unmounted */
  const layers = [
    "osm-wheelchair-unknown-label",
    "osm-wheelchair-no-label",
    "osm-wheelchair-limited-label",
    "osm-wheelchair-yes-label",
    "osm-poi-wheelchair-circle",
  ];
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // biome-ignore lint/complexity/noForEach: <explanation>
    layers.forEach((layerId) => {
      const featureIds = data?.features.map((feature) => feature._id);
      if (isFilteringActive && featureIds) {
        map?.getMap().setFilter(layerId, ["in", "id", ...featureIds]);
      } else {
        map?.getMap().setFilter(layerId, undefined);
      }
    });
  }, [isFilteringActive, data]);

  return (
    <>
      {(isLoading || isValidating) && <Spinner size="3" />}
      {!isLoading && !isValidating && !error && data?.features && (
        <StyledList>
          {data.features.map((feature) => (
            <ListItem
              feature={{ ...feature, "@type": "osm:Feature" }}
              key={feature._id}
            />
          ))}
        </StyledList>
      )}
    </>
  );
}
