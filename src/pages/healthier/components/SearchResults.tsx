import { t } from "ttag";
import { MockData } from "..";
import SearchResult from "./SearchResult";

type Props = {
  data : MockData[];
}

function SearchResults({ data }: Props) {

  const mockedData = data;

  return (
    <section className="search-results-section">
      <div className="search-results-container">
        <h2 className="search-results-h2"> {mockedData ? mockedData.length : ""} {t`Search Results`}</h2> 
        <ul className="search-results-list">
          {data.map((item: MockData) => {
            return (
              <li key={item._id}>
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
