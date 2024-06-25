import Head from "next/head";
// @ts-ignore
import { T, useT } from "@transifex/react";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import styled from "styled-components";
import useSWR from "swr";
import EnvContext from "../shared/EnvContext";
import SearchResult from "./SearchResult";
import { fetchJSON } from "./fetchJSON";
import { AmenityListResponse, calculateDistance, generateAmenityListURL, getWheelchairSettings } from "./helpers";
import { FullSizeFlexContainer, StyledH2, StyledLoadingSpinner, StyledMainContainerColumn, StyledSectionsContainer, StyledUL } from "./styles";

const HugeText = styled.p`
  font-size: 1.25rem;
  opacity: 0.92;
`;

function NonIdealContent() {
  const t = useT();

  return (
    <div style={{ marginTop: "10rem", textAlign: "center" }}>
      <HugeText>
        <T _str={`Find doctors, therapists, and health facilities near you.`} />
      </HugeText>
      <HugeText>
        <T _str={`You can choose further search criteria in the next step.`} />
      </HugeText>
    </div>
  );
}

function SearchResults() {
  const route = useRouter();
  const [myCoordinates, setMyCoordinates] = React.useState<[number, number]>([0, 0]);
  const env = useContext(EnvContext);

  const baseurl: string = env.NEXT_PUBLIC_OSM_API_BACKEND_URL;
  const finalURL = generateAmenityListURL(route.query, baseurl);
  const { data, error, isLoading } = useSWR<AmenityListResponse>(finalURL, fetchJSON);

  React.useEffect(() => {
    if (route.query.sort === "distance") {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          setMyCoordinates([position.coords.latitude, position.coords.longitude]);
          route.push({ query: { ...route.query, sort: "distance" } });
        }),
          (error: any) => {
            console.log(error);
          };
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
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
          if (route.query.sort === "distance") {
            item.distance = calculateDistance(myCoordinates[0], myCoordinates[1], lat, lon);
          } else {
            item.distance = calculateDistance(parseFloat(route.query.bbox[1]), parseFloat(route.query.bbox[0]), lat, lon);
          }
          return item;
        })
        .sort((a: { distance: number; properties: { name: string } }, b: { distance: number; properties: { name: any } }) => {
          if (!route.query.sort) return a?.properties?.name?.localeCompare(b?.properties?.name);
          if (route.query.sort === "alphabetically") return a?.properties?.name?.localeCompare(b?.properties?.name);
          if (route.query.sort === "distance") return a.distance - b.distance;
          if (route.query.sort === "distanceFromCity") return a.distance - b.distance;
        })
        .map((item: any, index: number, data: any) => {
          return <SearchResult key={index.toString()} data={item} />;
        })
        .slice(0, 100),
    [data, route.query]
  );

  const headText = `${data?.features?.length} ${getWheelchairSettings(route.query.wheelchair?.toString()).label} ${route.query.healthcare ? `${route.query.healthcare}` : ""} ${route.query.city ? `in ${route.query.city}` : ""}`;
  const text = React.useMemo(() => {
    if (data?.features?.length === 0) return <T _str={`No results found – please try again with a different location or different settings.`} />;
  }, [data]);

  return (
    <StyledMainContainerColumn>
      <Head>
        <title key="title">{sortedFeatures ? <T _str={`${headText} | Find health sites`} /> : <T _str={`Find health sites`} />}</title>
      </Head>
      {!isLoading && text && (
        <StyledH2 style={{ textAlign: "center" }} $fontBold>
          {text}
        </StyledH2>
      )}
      {isLoading && (
        <FullSizeFlexContainer>
          <StyledLoadingSpinner />
        </FullSizeFlexContainer>
      )}
      <StyledSectionsContainer>
        {sortedFeatures && <StyledUL>{sortedFeatures}</StyledUL>}
        {!sortedFeatures && !isLoading && <NonIdealContent />}
      </StyledSectionsContainer>
    </StyledMainContainerColumn>
  );
}

export default SearchResults;
