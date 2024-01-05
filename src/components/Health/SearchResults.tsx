import React from "react";
import useSWR from "swr";
import { t } from "ttag";
import { FilterContext, FilterContextType, getFilterInputExtent } from "./FilterContext";
import SearchResult from "./SearchResult";
import { OSM_API_FEATURE, fetcher, healthAPI } from "./helpers";
import { StlyedSecion, StyledH2, StyledLoadingSpinner } from "./styles";

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
  const extent: string = getFilterInputExtent(fc);

  const [city, setCity] = React.useState<string>("");
  const [searchResults, setSearchResults] = React.useState<OSM_API_FEATURE[]>(null);

  React.useEffect(() => {
    if (extent) {
      setCity(`city=${extent}`);
    }
  }, [city, extent, fc]);

  const finalURL = healthAPI({
    city: city,
    wheelchairAccessibility: "limited",
    limit: 100,
  });
  const { data, error } = useSWR<OSM_API_RESPONSE, Error>(finalURL, fetcher);

  React.useEffect(() => {
    if (data) {
      setSearchResults(data.nodes);
    }
  }, [data]);

  const loadingSpinner = (
    <StlyedSecion>
      <StyledH2>{t`Suchen ...`}</StyledH2>
      <StyledLoadingSpinner />
    </StlyedSecion>
  );

  const searchResultsUI = (
    <div className="search-results-container">
      <ul className="search-results-list">
        {searchResults &&
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

  if (error) return <div>{error.message}</div>;
  if (!searchResults && city != "" && Array.isArray(searchResults)) return loadingSpinner;
  return (
    <StlyedSecion>
      <StyledH2>
        {searchResults ? searchResults.length : ""} {t`Search Results`}
      </StyledH2>
      {searchResultsUI}
    </StlyedSecion>
  );
}

export default SearchResults;
