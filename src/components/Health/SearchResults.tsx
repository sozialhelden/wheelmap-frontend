import React from "react";
import styled from "styled-components";
import useSWR from "swr";
import { t } from "ttag";
import { FilterContext, FilterContextType, useFilterOptionsUrlInput } from "./FilterContext";
import SearchResult from "./SearchResult";
import { FilterOptions, calculateDistance, fetcher, getWheelchairSettings, useOsmAPIUrl } from "./helpers";
import { StyledH2, StyledLoadingSpinner, StyledMainContainerColumn, StyledSectionsContainer, StyledUL } from "./styles";

type ModalState = 'start' | 'empty' | 'loading' | 'error' | 'success';

const FullSizeFlexContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

function SearchResults() {
  const fc: FilterContextType = React.useContext(FilterContext);
  const filterOptions: FilterOptions = useFilterOptionsUrlInput(fc);

  const [myCoordinates, setMyCoordinates] = React.useState<[number, number]>([0, 0]);

  const finalURL = useOsmAPIUrl(filterOptions);
  const { data, error, isLoading } = useSWR<any, Error>(finalURL, fetcher);

  const filterOptionsStrings = {
    city: `in ${filterOptions.city}`,
    healthcare: `für ${filterOptions.healthcare ? `Einrichtungsart ${filterOptions.healthcare}` : `Alle Einrichtungsarten`}`,
    wheelchair: `und ${getWheelchairSettings(filterOptions.wheelchair).label}`,
  };

  React.useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setMyCoordinates([position.coords.latitude, position.coords.longitude]);
    });
  }, []);

  const sortedFeatures = React.useMemo(() =>
    data?.features &&
    data.features
      .map((item: any) => {
        const { centroid } = item;
        const lat = centroid.coordinates[1];
        const lon = centroid.coordinates[0];
        item.distance = calculateDistance(myCoordinates[0], myCoordinates[1], lat, lon).toFixed(2);
        return item;
      })
      .sort((a, b) => {
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

  const text = React.useMemo(
    () => {
      if (data?.features) {
        return t`${data?.features.length} Ergebnisse ${filterOptionsStrings.healthcare} ${filterOptionsStrings.city} ${filterOptionsStrings.wheelchair}`;
      }
      if (data?.features.length === 0) {
        return t`Keine Ergebnisse`;
      }
      return undefined;
    },
    [data, filterOptionsStrings]
  );

  return (
    <StyledMainContainerColumn style={{ alignItems: 'center' }}>
      {text && <StyledH2 $fontBold>{text}</StyledH2>}
      {isLoading && <FullSizeFlexContainer><StyledLoadingSpinner /></FullSizeFlexContainer>}
      <StyledSectionsContainer>
        {error && error.message && <FullSizeFlexContainer>{error.message}</FullSizeFlexContainer>}
        {sortedFeatures && (
          <StyledUL>
            {sortedFeatures}
          </StyledUL>
        )}
      </StyledSectionsContainer>
    </StyledMainContainerColumn>
  );
}

export default SearchResults;
