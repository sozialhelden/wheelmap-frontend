import { useRouter } from "next/router";
import React, { useContext } from "react";
import useSWR from "swr";
import { t } from "ttag";
import EnvContext from "../shared/EnvContext";
import SearchResult from "./SearchResult";
import { calculateDistance, fetcher, getWheelchairSettings, useOsmAPI } from "./helpers";
import { FullSizeFlexContainer, StyledChip, StyledH2, StyledHDivider, StyledLoadingSpinner, StyledMainContainerColumn, StyledSectionsContainer, StyledUL } from "./styles";

function SearchResults() {
  const route = useRouter();
  const [myCoordinates, setMyCoordinates] = React.useState<[number, number]>([0, 0]);
  const env = useContext(EnvContext);

  const baseurl: string = env.NEXT_PUBLIC_OSM_API_BACKEND_URL;
  const finalURL = useOsmAPI(route.query, baseurl, false);
  const { data, error, isLoading } = useSWR<any, Error>(finalURL, fetcher);

  React.useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setMyCoordinates([position.coords.latitude, position.coords.longitude]);
    });
  }, []);

  const sortedFeatures = React.useMemo(
    () =>
      route.query.bbox &&
      route.query.bbox !== "" &&
      route.query.bbox !== "undefined" &&
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
