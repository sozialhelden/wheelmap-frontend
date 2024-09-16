import { useRouter } from "next/router";
import React, { ReactElement, useRef } from "react";
import LayoutHealthPage from "../components/App/LayoutHealthPage";
import { FilterContext } from "../components/Health/FilterContext";
import SearchFilterDialog from "../components/Health/SearchFilterDialog";
import SearchResults from "../components/Health/SearchResults";
import { defaultFilterOptions } from "../components/Health/helpers";
import { StyledMainContainer } from "../components/Health/styles";

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

  const route = useRouter();
  const searchFiltersRef = useRef(null);

  React.useEffect(() => {
    if (searchFiltersRef.current) {
      searchFiltersRef.current.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    }
  }, [route.query]);

  return (
    <FilterContext.Provider value={memoizedFilterContext}>
      <StyledMainContainer>
        <div>
          <SearchFilterDialog />
          <div ref={searchFiltersRef}>
            <SearchResults />
          </div>
        </div>
      </StyledMainContainer>
    </FilterContext.Provider>
  );
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <LayoutHealthPage>{page}</LayoutHealthPage>;
};
