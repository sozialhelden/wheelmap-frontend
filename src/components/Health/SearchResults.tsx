import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import { t } from "ttag";
import SearchResult from "./SearchResult";
import { calculateDistance, fetcher, getWheelchairSettings, useOsmAPI } from "./helpers";
import { FullSizeFlexContainer, StyledChip, StyledH2, StyledHDivider, StyledLoadingSpinner, StyledMainContainerColumn, StyledSectionsContainer, StyledUL } from "./styles";

function SearchResults() {
  const route = useRouter();
  const [routeFilters, setRouteFilters] = React.useState<any>(route.query);
  const [myCoordinates, setMyCoordinates] = React.useState<[number, number]>([0, 0]);

  const baseurl: string = process.env.NEXT_PUBLIC_OSM_API_BACKEND_URL;
  const finalURL = useOsmAPI(routeFilters, baseurl, false);
  const { data, error, isLoading } = useSWR<any, Error>(finalURL, fetcher);

  React.useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setMyCoordinates([position.coords.latitude, position.coords.longitude]);
    });
  }, []);

  const sortedFeatures = React.useMemo(
    () =>
      data?.features &&
      data.features
        .map((item: any) => {
          const { centroid } = item;
          const lat = centroid.coordinates[1];
          const lon = centroid.coordinates[0];
          item.distance = calculateDistance(myCoordinates[0], myCoordinates[1], lat, lon).toFixed(2);
          return item;
        })
        .sort((a: { distance: number; properties: { name: string } }, b: { distance: number; properties: { name: any } }) => {
          if (route.query.sort === "distance") return a.distance - b.distance;
          if (route.query.sort === "alphabetically") return a?.properties?.name?.localeCompare(b?.properties?.name);
        })
        .map((item: any, index: number, data: any) => {
          return (
            <li key={index.toString()}>
              <SearchResult data={item} />
            </li>
          );
        })
        .slice(0, 100),
    [data, route.query]
  );
  const text = React.useMemo(() => {
    if (data?.features?.length === 0) {
      return t`No Results Found! Please try again with different City/Filters`;
    }
    if (data?.features) {
      return (
        <>
          <StyledChip>
            {t`Results`} : {data?.features.length}
          </StyledChip>
          <StyledChip>{route.query.healthcare ? `${route.query.healthcare}` : t`All Categories`}</StyledChip>
          {route.query.city && <StyledChip>{route.query.city}</StyledChip>}
          <StyledChip>{getWheelchairSettings(route.query.wheelchair?.toString()).label}</StyledChip>
        </>
      );
    }
  }, [data]);

  React.useEffect(() => {
    setRouteFilters(route.query);
  }, [route.query]);

  return (
    <StyledMainContainerColumn>
      <StyledHDivider $space={0.5} />
      {!isLoading && text && (
        <StyledH2 style={{ textAlign: "center" }} $fontBold>
          {text}
        </StyledH2>
      )}
      <StyledHDivider $space={0.5} />
      {isLoading && (
        <FullSizeFlexContainer>
          <StyledLoadingSpinner />
        </FullSizeFlexContainer>
      )}
      <StyledSectionsContainer>{sortedFeatures && <StyledUL>{sortedFeatures}</StyledUL>}</StyledSectionsContainer>
    </StyledMainContainerColumn>
  );
}

export default SearchResults;
