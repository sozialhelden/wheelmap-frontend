import React, { ReactElement } from "react";
import LayoutHealthPage from "../../components/App/LayoutHealthPage";
import { FilterContext } from "../../components/Health/FilterContext";
import SearchFilters from "../../components/Health/SearchFilters";
import SearchResults from "../../components/Health/SearchResults";
import { defaultFilterOptions } from "../../components/Health/helpers";
import { StyledHealthSiteContent } from "../../components/Health/styles";
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

export default function Page() {
  const [filterMap, setFilterMap] = React.useState<Map<string, boolean>>(new Map<string, boolean>());
  const [filterOptions, setFilterOptions] = React.useState(defaultFilterOptions);
  const [healthcareOptions, setHealthcareOptions] = React.useState([{ healthcare: "", count: 0 }]);
  const [healthcareSpecialityOptions, setHealthcareSpecialityOptions] = React.useState([{ healthcare: "", count: 0 }]);
  const memoizedFilterContext = React.useMemo(() => ({ filterMap, setFilterMap, filterOptions, setFilterOptions, healthcareOptions, setHealthcareOptions, healthcareSpecialityOptions, setHealthcareSpecialityOptions }), [filterMap, setFilterMap, filterOptions, setFilterOptions, healthcareOptions, setHealthcareOptions, healthcareSpecialityOptions, setHealthcareSpecialityOptions]);

  return (
    <FilterContext.Provider value={memoizedFilterContext}>
      <StyledHealthSiteContent>
        <SearchFilters />
        <SearchResults />
      </StyledHealthSiteContent>
    </FilterContext.Provider>
  );
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <LayoutHealthPage>{page}</LayoutHealthPage>;
};
