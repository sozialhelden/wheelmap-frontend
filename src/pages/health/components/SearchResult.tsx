import { OSM_API_FEATURE } from "./helpers";

type Props = {
  data: OSM_API_FEATURE;
}

function SearchResult({ data }: Props) {

  const searchResult = data;
  
  const name = typeof searchResult.name === 'string' ? searchResult.name : "Praxis Dr. Linker Platzhalter";
  const { street, city, housenumber, postcode } = searchResult || {};
  const node_type = searchResult.node_type.identifier;
  const category = searchResult.category.identifier;

  return (
    <div className="search-result">
      <h3 className="search-result-heading">{name as string}</h3>
      <p className="search-result-address">{ [street, housenumber, postcode, city].join(", ")}</p>
      <p className="search-result-description">{ node_type || category ? [node_type, category].join(", ") : 'Keine Adresse' }</p>
    </div>
  );
}

export default SearchResult;