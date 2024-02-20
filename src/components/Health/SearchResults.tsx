import React from "react";
import useSWR from "swr";
import { t } from "ttag";
import {
  FilterContext,
  FilterContextType,
  getFilterInputCity,
} from "./FilterContext";
import SearchResult from "./SearchResult";
import { OSM_API_FEATURE, fetcher, healthAPI, limitValue } from "./helpers";
import { StlyedSecion, StyledH2, StyledLoadingSpinner } from "./styles";
const useRouter = require("next/router").useRouter;

type Props = {};

type EXTENT = [number, number, number, number];
type OSM_API_RESPONSE = {
  conditions: {
    limit: number;
    offset: number;
    page: string;
    per_page: string;
    format: string;
    bbox: EXTENT;
  };
  type: "LegacyFeatureCollection";
  nodes: OSM_API_FEATURE[];
};

function SearchResults({}: Props) {
  const fc: FilterContextType = React.useContext(FilterContext);
  const extent: string = getFilterInputCity(fc);
  const [city, setCity] = React.useState<string>("");
  const [wheelchair, setWheelchair] = React.useState<string>("");
  const [healthcare, setHealthcare] = React.useState<string>("");
  const [limit, setLimit] = React.useState<string>("");
  const [searchResults, setSearchResults] = React.useState<any[]>(null);
  React.useEffect(() => {
    if (extent) {
      setCity(`city=${extent}`);
      setWheelchair(`wheelchair=yes`);
      setHealthcare(`healthcare=pharmacy`);
      setLimit(`limit=${limitValue}`);
    }
  }, [city, extent, fc]);

  const finalURL = healthAPI({
    city: city,
    wheelchair: wheelchair,
    healthcare: healthcare,
    limit: limit,
  });
  const { data, error } = useSWR<any, Error>(finalURL, fetcher);

  React.useEffect(() => {
    if (data) {
      setSearchResults(data);
    }
    if (error) {
      console.log(error);
    }
  }, [data, error]);

  const loadingSpinner = (
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

  if (!searchResults && city != "" && Array.isArray(searchResults))
    return loadingSpinner;
  return (
    <StlyedSecion>
      <StyledH2>
        {searchResults ? searchResults.length : ""} {t`Search Results für `}
        {extent}
        {error && error.message && `: ${error.message}`}
      </StyledH2>
      {searchResultsUI}
    </StlyedSecion>
  );
}

export default SearchResults;
