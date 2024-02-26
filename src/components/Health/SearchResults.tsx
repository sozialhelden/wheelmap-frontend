import React from "react";
import useSWR from "swr";
import { t } from "ttag";
import { FilterContext, FilterContextType, getFilterOptionsInput } from "./FilterContext";
import SearchResult from "./SearchResult";
import { FilterOptions, OSM_API_FEATURE, fetcher, useHealthAPIURL } from "./helpers";
import { StlyedSecion, StyledH2, StyledLoadingSpinner } from "./styles";
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
        city: `city=${filterOptionsFC.city}`,
        wheelchair: `wheelchair=${filterOptionsFC.wheelchair}`,
        healthcare: `healthcare=${filterOptionsFC.healthcare}`,
        limit: `limit=${filterOptionsFC.limit}`,
        ["healthcare:speciality"]: `healthcare:speciality=${filterOptionsFC["healthcare:speciality"]}`,
      });
    }
  }, [fc, filterOptionsFC]);

  const finalURL = useHealthAPIURL({
    city: filterOptions.city,
    wheelchair: filterOptions.wheelchair,
    limit: filterOptions.limit,
    healthcare: filterOptions.healthcare,
    ["healthcare:speciality"]: filterOptions["healthcare:speciality"],
  });
  const { data, error } = useSWR<any, Error>(finalURL, fetcher);

  React.useEffect(() => {
    setLoadingSpinner(true);
    if (data) {
      setSearchResults(data);
      setLoadingSpinner(false);
    }
  }, [data]);

  const loadingSpinnerUI = (
    <StlyedSecion>
      <StyledH2>{t`Suchen ...`}</StyledH2>
      <StyledLoadingSpinner />
    </StlyedSecion>
  );

  const searchResultsUI = (
    <div className="search-results-container">
      <ul className="search-results-list">
        {Array.isArray(searchResults) &&
          searchResults.map((item: OSM_API_FEATURE) => {
            return (
              <li key={item.osm_id}>
                <SearchResult data={item} />
              </li>
            );
          })}
      </ul>
    </div>
  );

  return (
    <StlyedSecion>
      <StyledH2>
        {Array.isArray(searchResults) ? t`Ergebnisse für ` + filterOptionsFC.city + ` (${searchResults.length})` : t`Keine Ergebnisse für ` + filterOptionsFC.city}
        {error && error.message && `: ${error.message}`}
      </StyledH2>
      {loadingSpinner ? loadingSpinnerUI : searchResultsUI}
    </StlyedSecion>
  );
}

export default SearchResults;
