import Head from "next/head";
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
    if (route.query.sort === "distance") {
      navigator.geolocation.getCurrentPosition((position) => {
        setMyCoordinates([position.coords.latitude, position.coords.longitude]);
        route.push({ query: { ...route.query, sort: "distance" } });
      });
    }
  }, [route.query.sort]);

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
          if (!route.query.sort) return a?.properties?.name?.localeCompare(b?.properties?.name);
          if (route.query.sort === "alphabetically") return a?.properties?.name?.localeCompare(b?.properties?.name);
          if (route.query.sort === "distance") return a.distance - b.distance;
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

  const headText = `${data?.features.length} ${getWheelchairSettings(route.query.wheelchair?.toString()).label} ${route.query.healthcare ? t`${route.query.healthcare}` : ""} ${route.query.city ? `in ${route.query.city}` : ""}`;
  const text = React.useMemo(() => {
    if (data?.features?.length === 0) {
      return t`No Results Found! Please try again with different City/Filters`;
    }
    if (data?.features) {
      return <StyledChip>{headText}</StyledChip>;
    }
  }, [data]);

  if (!sortedFeatures) return null;
  return (
    <StyledMainContainerColumn>
      <Head>
        <title key="title">{sortedFeatures ? t`${headText} | Find health sites` : t`Find health sites`}</title>
      </Head>
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
      <StyledSectionsContainer>
        {sortedFeatures && <StyledUL>{sortedFeatures}</StyledUL>}
        {!sortedFeatures && !isLoading && (
          <>
            <StyledH2 $fontBold $textAlign="center">{t`Here you will find health centers, as well as psychotherapists, physiotherapists, and more medical facilities near you`}</StyledH2>
            <StyledH2 $textAlign="center">{t`You can choose further search criteria in the next step.`}</StyledH2>
          </>
        )}
      </StyledSectionsContainer>
    </StyledMainContainerColumn>
  );
}

export default SearchResults;
