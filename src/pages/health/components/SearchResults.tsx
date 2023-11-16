import React from "react";
import useSWR from "swr";
import { t } from "ttag";
import { FilterContext, FilterContextType, getFilterInputExtent } from "./FilterContext";
import SearchResult from "./SearchResult";
import { OSM_API_FEATURE, fetcher } from "./helpers";

type Props = {
}
type EXTENT = [number, number, number, number];

type OSM_API_RESPONSE = {
    "conditions": {
      "limit": number,
      "offset": number,
      "page": string,
      "per_page": string,
      "format": string,
      "bbox": EXTENT,
    },
    "type": "LegacyFeatureCollection",
    "nodes": OSM_API_FEATURE[],
  }

function SearchResults({}: Props) {

  const fc: FilterContextType = React.useContext(FilterContext);
  const extent: EXTENT  = getFilterInputExtent(fc);

  const [bbox, setBbox] = React.useState<string>('');
  const [searchResults, setSearchResults] = React.useState<OSM_API_FEATURE[]>(null);

  const baseurl: string = process.env.NEXT_PUBLIC_OSM_API_LEGACY_BASE_URL;
  
  React.useEffect(() => {
    if (extent) {
      setBbox(`bbox=${extent[0]},${extent[1]},${extent[2]},${extent[3]}`);
      console.log(`${baseurl}/api/healthcare?${bbox}&geometry=centroid&wheelchairAccessibility=yes&limit=100`);
    }
  }
  , [extent, fc]);

  
  const {data, error} = useSWR<OSM_API_RESPONSE, Error>(
    bbox 
    ? `${baseurl}/api/healthcare?${bbox}&geometry=centroid&wheelchairAccessibility=yes&limit=100` 
    : null, 
    fetcher);

  React.useEffect(() => {
    if(data) {
      setSearchResults(data.nodes);
    }
  }, [data]);

  if (error) return <div>{error.message}</div>
  if (!data) {
    return (
      <section className="search-results-section">
        <h2 className="search-results-h2">{t`Search Results`}</h2> 
        <div className="search-results-container">Loading...</div>
      </section>
    );
  }
  // searchResults && console.log('searchResults', JSON.stringify(searchResults, null, 2) );


  return (
    <section className="search-results-section">
      <div className="search-results-container">
      <h2 className="search-results-h2"> {searchResults ? searchResults.length : ""} {t`Search Results`}</h2> 
        <ul className="search-results-list">
          {searchResults && searchResults.map((item: OSM_API_FEATURE) => {
            return (
              <li key={item.osm_id}>
                <SearchResult 
                data={item}/>
              </li>
            );
          })}
        </ul>
      </div>   
    </section>
  );
}


export default SearchResults;
