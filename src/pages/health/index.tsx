import React, { ReactElement } from "react";
import LayoutHealthPage from "../../components/App/LayoutHealthPage";
import { FilterContext } from "../../components/Health/FilterContext";
import SearchFilters from "../../components/Health/SearchFilters";
import SearchResults from "../../components/Health/SearchResults";
import { defaultFilterOptions } from "../../components/Health/helpers";
import { StyledMainContainer } from "../../components/Health/styles";

export default function Page() {
  const [filterOptions, setFilterOptions] = React.useState(defaultFilterOptions);
  const [healthcareOptions, setHealthcareOptions] = React.useState([{ healthcare: "", count: 0 }]);
  const [healthcareSpecialityOptions, setHealthcareSpecialityOptions] = React.useState([{ healthcare: "", count: 0 }]);
  const memoizedFilterContext = React.useMemo(
    () => ({
      filterOptions,
      setFilterOptions,
      healthcareOptions,
      setHealthcareOptions,
      healthcareSpecialityOptions,
      setHealthcareSpecialityOptions,
    }),
    [filterOptions, setFilterOptions, healthcareOptions, setHealthcareOptions, healthcareSpecialityOptions, setHealthcareSpecialityOptions]
  );

  return (
    <FilterContext.Provider value={memoizedFilterContext}>
      <StyledMainContainer>
        <div>
          <SearchFilters />
          <SearchResults />
        </div>
      </StyledMainContainer>
    </FilterContext.Provider>
  );
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <LayoutHealthPage>{page}</LayoutHealthPage>;
};
