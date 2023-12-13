import React, { ReactElement } from "react";
import styled from "styled-components";
import { t } from "ttag";
import LayoutHealthPage from "../../components/App/LayoutHealthPage";
import { FilterContext } from "./components/FilterContext";
import SearchFilters from "./components/SearchFilters";
import SearchResults from "./components/SearchResults";
import { mockedHealthcareFacilities } from "./mocks";
import { StyledH1, StyledHealthSiteContent } from "./styles";
/*
  A11y Design considerations
  - https://www.w3.org/WAI/tutorials/forms/
  - https://www.w3.org/WAI/tutorials/forms/labels/
  - https://www.w3.org/WAI/tutorials/forms/grouping/
  - https://www.w3.org/WAI/tutorials/forms/controls/
  - https://www.w3.org/WAI/tutorials/forms/notifications/
  - https://www.w3.org/WAI/tutorials/forms/inputs/
  - https://www.w3.org/WAI/tutorials/forms/inputs/select/
  ...
  --- 

  pagination? 


  summary details
  oder dialog 
  cards: keine bubbles- nur für filter-a11y labels auf den cards
*/

const StyledPage = styled.div`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .search-results-container {
    width: min(100% - 2rem, max(600px, calc(100vw - 1rem)));
    margin-inline: auto;
    margin-bottom: 1rem;
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
  }

  .search-results-list {
    list-style-type: none;
  }

  .search-result {
    display: flex;
    flex-direction: column;
    width: 95%;
    margin-block: 0.7rem;

    height: fit-content;
    background-color: beige;
    border-radius: 0.3rem;
    padding: 0.4rem;
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.05) 0px 1px 3px 1px;
  }

  .search-results-h2 {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .search-result-address,
  .search-result-heading,
  .search-result-description {
    font-size: 1rem;
    line-height: 1.2;
  }

  .search-result-heading {
    font-weight: 700;
  }

  .search-result-address {
    margin-block: 0.5rem;
  }

  .search-result-description {
    display: flex;
    gap: 0.2rem;
  }
`;

export default function Page() {
  // TODOS: get photon api bbox for query
  // const [searchResult, setSearchResult] = React.useState<any>([]);
  // const memoizedSearchResultsContext = React.useMemo(() => ({ searchResult, setSearchResult }), [searchResult, setSearchResult]);

  const [filterMap, setFilterMap] = React.useState<Map<string, boolean>>(new Map<string, boolean>());
  const [extent, setExtent] = React.useState<[number, number, number, number]>(null);
  const memoizedFilterContext = React.useMemo(() => ({ filterMap, setFilterMap, extent, setExtent }), [filterMap, setFilterMap, extent, setExtent]);

  const labels = ["Aufzug", "Ebenerdiger Eingang", "Parkplatz", "Leichte Sprache", "Gebärdensprache"];

  return (
    <FilterContext.Provider value={memoizedFilterContext}>
      <StyledPage>
        <StyledHealthSiteContent>
          <StyledH1>{t`Praxissuche`}</StyledH1>
          <SearchFilters mockFacilities={mockedHealthcareFacilities} labels={labels} />
          <SearchResults />
        </StyledHealthSiteContent>
      </StyledPage>
    </FilterContext.Provider>
  );
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <LayoutHealthPage>{page}</LayoutHealthPage>;
};
