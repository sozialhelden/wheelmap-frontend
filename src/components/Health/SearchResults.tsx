import React from "react";
import useSWR from "swr";
import { t } from "ttag";
import { FilterContext, FilterContextType, useFilterOptionsUrlInput } from "./FilterContext";
import SearchResult from "./SearchResult";
import { FilterOptions, calculateDistance, fetcher, getWheelchairSettings, useOsmAPIUrl } from "./helpers";
import { FullSizeFlexContainer, StyledChip, StyledH2, StyledHDivider, StyledLoadingSpinner, StyledMainContainerColumn, StyledSectionsContainer, StyledUL } from "./styles";

function SearchResults() {
  const fc: FilterContextType = React.useContext(FilterContext);
  const filterOptions: FilterOptions = useFilterOptionsUrlInput(fc);

  const [myCoordinates, setMyCoordinates] = React.useState<[number, number]>([0, 0]);

  const finalURL = useOsmAPIUrl(filterOptions);
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
          if (filterOptions.sort === "d:asc") return a.distance - b.distance;
          if (filterOptions.sort === "a:asc") return a?.properties?.name?.localeCompare(b?.properties?.name);
        })
        .map((item: any, index: number, data: any) => {
          return (
            <li key={index.toString()}>
              <SearchResult data={item} />
            </li>
          );
        })
        .slice(0, 100),
    [data, filterOptions]
  );
  const text = React.useMemo(() => {
    if (data?.features.length === 0) {
      return t`No Results Found!`;
    }
    if (data?.features) {
      return (
        <>
          <StyledChip>
            {t`Results`} : {data?.features.length}
          </StyledChip>
          <StyledChip>{filterOptions.healthcare ? `${filterOptions.healthcare}` : t`All Categories`}</StyledChip>
          {filterOptions.city && <StyledChip>{filterOptions.city}</StyledChip>}
          <StyledChip>{getWheelchairSettings(filterOptions.wheelchair).label}</StyledChip>
        </>
      );
    }
  }, [data]);

  return (
    <StyledMainContainerColumn>
      <StyledHDivider $space={0.5} />
      {text && (
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
        {error && error.message && <FullSizeFlexContainer>{error.message}</FullSizeFlexContainer>}
        {sortedFeatures && <StyledUL>{sortedFeatures}</StyledUL>}
      </StyledSectionsContainer>
    </StyledMainContainerColumn>
  );
}

export default SearchResults;
