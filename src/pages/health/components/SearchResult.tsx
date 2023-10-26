import { t } from "ttag";
import { MockData } from "..";

type Props = {
  data: MockData;
}

function SearchResult({ data }: Props) {

  const searchResult = data;
  
  const name = typeof searchResult.properties.name === 'string' ? searchResult.properties.name : searchResult.properties.name?.en ?? "Praxis Dr. Linker Platzhalter";
  const { street, city, house, postalCode, text } = searchResult.properties.address || {};
  const description = searchResult.properties.description?.en ?? "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

  return (
    <div className="search-result">
      <h3 className="search-result-heading">{name as string}</h3>
      <p className="search-result-address">{text ? text : "Keine Adresse"}</p>
      <p className="search-result-description">{ description ? description : t`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`}</p>
    </div>
  );
}

export default SearchResult;