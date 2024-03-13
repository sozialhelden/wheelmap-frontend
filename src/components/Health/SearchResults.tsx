import React from "react";
import useSWR from "swr";
import { t } from "ttag";
import { FilterContext, FilterContextType, getFilterOptionsInput } from "./FilterContext";
import SearchResult from "./SearchResult";
import { FilterOptions, calculateDistance, fetcher, getWheelchairSettings, useHealthAPIURL } from "./helpers";
import { StyledH2, StyledLoadingSpinner, StyledSection, StyledUL } from "./styles";

function SearchResults() {
  const fc: FilterContextType = React.useContext(FilterContext);
  const filterOptionsFC: FilterOptions = getFilterOptionsInput(fc);
  const [filterOptions, setFilterOptions] = React.useState<FilterOptions>(filterOptionsFC);
  const [searchResults, setSearchResults] = React.useState<any[]>(null);
  const [headerOptions, setHeaderOptions] = React.useState<any>({
    loadingSpinner: true,
    text: t`Suchen ...`,
  });
  const [myCoordinates, setMyCoordinates] = React.useState<[number, number]>([0, 0]);

  React.useEffect(() => {
    if (filterOptionsFC) {
      setFilterOptions({
        city: filterOptionsFC.city,
        bbox: filterOptionsFC.bbox,
        wheelchair: `${filterOptionsFC.wheelchair}`,
        healthcare: `${filterOptionsFC.healthcare}`,
        ["healthcare:speciality"]: `${filterOptionsFC["healthcare:speciality"]}`,
        sort: `${filterOptionsFC.sort}`,
        name: `${filterOptionsFC.name}`,
      });
    }
  }, [fc, filterOptionsFC]);

  const finalURL = useHealthAPIURL({
    bbox: filterOptions.bbox,
    wheelchair: filterOptions.wheelchair,
    healthcare: filterOptions.healthcare,
    ["healthcare:speciality"]: filterOptions["healthcare:speciality"],
  });
  const { data, error } = useSWR<any, Error>(finalURL, fetcher);

  const filterOptionsStrings = {
    city: `in ${filterOptions.city}`,
    healthcare: `für ${filterOptions.healthcare ? `Einrichtungsart ${filterOptions.healthcare}` : `Alle Einrichtungsarten`}`,
    wheelchair: `und ${getWheelchairSettings(filterOptions.wheelchair).label}`,
  };

  React.useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setMyCoordinates([position.coords.latitude, position.coords.longitude]);
    });
  }, [myCoordinates]);

  React.useEffect(() => {
    setHeaderOptions({
      loadingSpinner: true,
      text: t`Suchen ...`,
    });
    if (data) {
      setSearchResults(data.features);
      setHeaderOptions({
        loadingSpinner: false,
        text: Array.isArray(searchResults) ? t`${searchResults.length} Ergebnisse ${filterOptionsStrings.healthcare} ${filterOptionsStrings.city} ${filterOptionsStrings.wheelchair}` : t`Keine Ergebnisse`,
      });
    }
  }, [data, fc, filterOptions.city, filterOptions.healthcare, filterOptions.wheelchair, filterOptionsStrings.city, filterOptionsStrings.healthcare, filterOptionsStrings.wheelchair, searchResults]);

  const HeaderUI = (
    <>
      <StyledH2>{headerOptions.text}</StyledH2>
      {headerOptions.loadingSpinner && <StyledLoadingSpinner />}
    </>
  );

  const searchResultsUI = (
    <StyledUL>
      {Array.isArray(searchResults) &&
        searchResults
          .map((item: any) => {
            const { centroid } = item;
            const lat = centroid.coordinates[1];
            const lon = centroid.coordinates[0];
            item.distance = calculateDistance(myCoordinates[0], myCoordinates[1], lat, lon).toFixed(2);
            return item;
          })
          .filter((item: any) => item?.properties?.name?.toLowerCase().includes(filterOptions.name.toLowerCase()))
          .sort((a, b) => {
            if (filterOptions.sort === "d:asc") return a.distance - b.distance;
            if (filterOptions.sort === "d:desc") return b.distance - a.distance;
            if (filterOptions.sort === "a:asc") return a?.properties?.name?.localeCompare(b?.properties?.name);
            if (filterOptions.sort === "a:desc") return b?.properties?.name?.localeCompare(a?.properties?.name);
          })
          .map((item: any, index: number, data: any) => {
            return (
              <li key={index.toString()}>
                <SearchResult data={item} />
              </li>
            );
          })}
    </StyledUL>
  );

  return (
    <StyledSection>
      <>
        {HeaderUI}
        {error && error.message && `: ${error.message}`}
      </>
      {!headerOptions.loadingSpinner && searchResultsUI}
    </StyledSection>
  );
}

export default SearchResults;
