import React from "react";
import useSWR from "swr";
import { t } from "ttag";
import { FilterContext, FilterContextType, getFilterOptionsInput } from "./FilterContext";
import SearchResult from "./SearchResult";
import { FilterOptions, OSM_API_FEATURE, fetcher, getWheelchairSettings, useHealthAPIURL } from "./helpers";
import { StyledH2, StyledLoadingSpinner, StyledSection, StyledUL } from "./styles";
type Props = {};
function SearchResults({}: Props) {
  const fc: FilterContextType = React.useContext(FilterContext);
  const filterOptionsFC: FilterOptions = getFilterOptionsInput(fc);
  const [filterOptions, setFilterOptions] = React.useState<FilterOptions>(filterOptionsFC);
  const [searchResults, setSearchResults] = React.useState<any[]>(null);
  const [headerOptions, setHeaderOptions] = React.useState<any>({
    loadingSpinner: true,
    text: t`Suchen ...`,
  });

  React.useEffect(() => {
    if (filterOptionsFC) {
      setFilterOptions({
        city: filterOptionsFC.city,
        bbox: filterOptionsFC.bbox,
        wheelchair: `${filterOptionsFC.wheelchair}`,
        healthcare: `${filterOptionsFC.healthcare}`,
        ["healthcare:speciality"]: `${filterOptionsFC["healthcare:speciality"]}`,
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

  React.useEffect(() => {
    setHeaderOptions({
      loadingSpinner: true,
      text: t`Suchen ...`,
    });
    if (data) {
      setSearchResults(data.features);
      setHeaderOptions({
        loadingSpinner: false,
        text: Array.isArray(searchResults) ? t`${searchResults.length} Ergebnisse für Einrichtungsart ${filterOptions.healthcare} in ${filterOptions.city} und ${getWheelchairSettings(filterOptions.wheelchair).label}` : t`Keine Ergebnisse`,
      });
    }
  }, [data, fc, filterOptions.city, filterOptions.healthcare, filterOptions.wheelchair, searchResults]);

  const HeaderUI = (
    <>
      <StyledH2>{headerOptions.text}</StyledH2>
      {headerOptions.loadingSpinner && <StyledLoadingSpinner />}
    </>
  );

  const searchResultsUI = (
    <StyledUL>
      {Array.isArray(searchResults) &&
        searchResults.map((item: OSM_API_FEATURE, index: number) => {
          return (
            <li key={index}>
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
