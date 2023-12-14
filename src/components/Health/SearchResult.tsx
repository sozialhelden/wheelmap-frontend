import { OSM_API_FEATURE } from "./helpers";
import { StyledDescription } from "./styles";

type Props = {
  data: OSM_API_FEATURE;
};

function SearchResult({ data }: Props) {
  const searchResult = data;

  const name = typeof searchResult.name === "string" ? searchResult.name : "Praxis Dr. Linker Platzhalter";
  const { street, city, housenumber, postcode } = searchResult || {};
  const customStreet = street ? street + ", " : "";
  const customHousenumber = housenumber ? housenumber + ", " : "";
  const customPostcode = postcode ? postcode + ", " : "";
  const customCity = city ? city : "";
  const node_type = searchResult.node_type.identifier;
  const category = searchResult.category.identifier;

  const nodeTypes =
    node_type || category
      ? Array.from([node_type, category]).map((item, index) => {
          return item && <StyledDescription key={index}>{item.replace("_", " ").toUpperCase()}</StyledDescription>;
        })
      : "Keine Adresse";
  return (
    <div className="search-result">
      <h3 className="search-result-heading">{name}</h3>
      <p className="search-result-address">{[customStreet, customHousenumber, customPostcode, customCity].join("")}</p>
      <p className="search-result-description">{nodeTypes}</p>
    </div>
  );
}

export default SearchResult;
