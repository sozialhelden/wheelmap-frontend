import React from "react";
import useSWR from "swr";
import { t } from "ttag";
import { FilterContext, FilterContextType, getFilterOptionsInput } from "./FilterContext";
import SearchResult from "./SearchResult";
import { FilterOptions, OSM_API_FEATURE, fetcher, useHealthAPIURL } from "./helpers";
import { StyledH2, StyledLoadingSpinner, StyledSection, StyledUL } from "./styles";
type Props = {};
function SearchResults({}: Props) {
  const fc: FilterContextType = React.useContext(FilterContext);
  const filterOptionsFC: FilterOptions = getFilterOptionsInput(fc);
  const [filterOptions, setFilterOptions] = React.useState<FilterOptions>(filterOptionsFC);
  const [searchResults, setSearchResults] = React.useState<any[]>(null);
  const [loadingSpinner, setLoadingSpinner] = React.useState<boolean>(true);
  React.useEffect(() => {
    if (filterOptionsFC) {
      setFilterOptions({
        bbox: filterOptionsFC.bbox,
        wheelchair: `wheelchair=${filterOptionsFC.wheelchair}`,
        healthcare: `healthcare=${filterOptionsFC.healthcare}`,
        ["healthcare:speciality"]: `healthcare:speciality=${filterOptionsFC["healthcare:speciality"]}`,
        limit: `limit=${filterOptionsFC.limit}`,
      });
    }
  }, [fc, filterOptionsFC]);

  const finalURL = useHealthAPIURL({
    bbox: filterOptions.bbox,
    wheelchair: filterOptions.wheelchair,
    healthcare: filterOptions.healthcare,
    ["healthcare:speciality"]: filterOptions["healthcare:speciality"],
    limit: filterOptions.limit,
  });
  const { data, error } = useSWR<any, Error>(finalURL, fetcher);

  React.useEffect(() => {
    setLoadingSpinner(true);
    if (data) {
      setSearchResults(data.features);
      setLoadingSpinner(false);
    }
  }, [data, fc]);

  const loadingSpinnerUI = (
    <StyledSection>
      <StyledH2>{t`Suchen ...`}</StyledH2>
      <StyledLoadingSpinner />
    </StyledSection>
  );

  const searchResultsUI = (
    <StyledSection>
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
    </StyledSection>
  );

  return (
    <StyledSection>
      <StyledH2>
        {Array.isArray(searchResults) ? t`Ergebnisse (${searchResults.length})` : t`Keine Ergebnisse`}
        {error && error.message && `: ${error.message}`}
      </StyledH2>
      {loadingSpinner ? loadingSpinnerUI : searchResultsUI}
    </StyledSection>
  );
}

export default SearchResults;
