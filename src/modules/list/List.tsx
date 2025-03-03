import { Flex, Spinner, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import type { LngLatBounds } from "react-map-gl/mapbox";
import styled from "styled-components";
import useSWR from "swr";
import { t } from "ttag";
import {
  makeFilterById,
  useMapFilterContext,
  useMapHighlight,
} from "~/components/Map/filter";
import { useMap } from "~/components/Map/useMap";
import { genericFetcher } from "~/lib/fetchers/useFeatures/fetchers";
import type { OSMFeatureCollection } from "~/lib/model/geo/AnyFeature";
import type { OSMId } from "~/lib/typing/brands/osmIds";
import { useCategoryFilter } from "~/modules/categories/contexts/CategoryFilterContext";
import { ListItem } from "~/modules/list/ListItem";
import { useOsmApiFilterQuery } from "~/modules/osm-api/hooks/useOsmApiFilterQuery";
import { useOsmApiUrl } from "~/modules/osm-api/hooks/useOsmApiUrl";

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

export function List() {
  const { category } = useCategoryFilter();
  const { map } = useMap();

  window.map = map;

  const [boundingBox, setBoundingBox] = useState<LngLatBounds>();

  const calculateBoundingBox = () => {
    if (category) {
      setBoundingBox(map?.getBounds());
    } else {
      setBoundingBox(undefined);
    }
  };

  useEffect(() => {
    calculateBoundingBox();
  }, [category, map]);
  useEffect(() => {
    map?.on("moveend", calculateBoundingBox);
    return () => {
      map?.off("moveend", calculateBoundingBox);
    };
  }, [map]);

  const params = useOsmApiFilterQuery();
  const url = useOsmApiUrl({
    path: "amenities",
    format: "json",
    params: {
      ...params,
      limit: "30",
    },
    suffix: "&bbox=" + boundingBox?.toArray().join(","),
  });
  const { data, error, isLoading } = useSWR<OSMFeatureCollection>(
    url,
    genericFetcher,
  );

  // const { addFilter, filter, removeById } = useMapFilterContext();

  // useEffect(() => {
  //   const filterId = addFilter({
  //     id: undefined,
  //     layer: undefined,
  //     expression: [
  //       "in",
  //       ["get", "id"],
  //       ...(data?.features.map(({ _id }) => _id) || []),
  //     ],
  //   }).id;
  //
  //   return () => {
  //     removeById(filterId);
  //   };
  // }, [data, addFilter, removeById]);

  return (
    <>
      {isLoading && (
        <Flex justify="center" mt="4">
          <Spinner size="3" />
        </Flex>
      )}
      {data?.features.length === 0 && (
        <Flex justify="center" mt="4">
          <Text>{t`Nothing found in this area! 👀`}</Text>
        </Flex>
      )}
      <div>
        {/*<pre>{JSON.stringify(filter, null, 2)}</pre>*/}
        {/*<h1>List</h1>*/}
        {/*/!*<pre>{JSON.stringify(boundingBox, null, 2)}</pre>*!/*/}
        {/*/!*{JSON.stringify(data, null, 2)}*!/*/}
      </div>
      <StyledList>
        {data?.features.map((feature) => (
          <li key={feature._id}>
            <ListItem feature={{ "@type": "osm:Feature", ...feature }} />
          </li>
        ))}
      </StyledList>
    </>
  );
}
