import { useRouter } from "next/router";
import React, { ReactElement, useContext, useRef } from "react";
import useSWR from "swr";
import LayoutHealthPage from "../components/App/LayoutHealthPage";
import { fetchJSON } from "../components/Health/fetchJSON";
import { FilterContext } from "../components/Health/FilterContext";
import { generateAccessibilityAttributesURL } from "../components/Health/helpers";
import SearchFilterDialog from "../components/Health/SearchFilterDialog";
import SearchResults from "../components/Health/SearchResults";
import { StyledMainContainer } from "../components/Health/styles";
import EnvContext from "../components/shared/EnvContext";

export default function Page() {
  const memoizedFilterContext = React.useMemo(() => ({}), []);

  const route = useRouter();
  const searchFiltersRef = useRef(null);

  React.useEffect(() => {
    if (searchFiltersRef.current) {
      searchFiltersRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [route.query]);

  const env = useContext(EnvContext);
  const accessibilityAttributesBaseURL = env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_UNCACHED_BASE_URL;
  const accessibilityAttributesappToken = env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_APP_TOKEN;
  const accessibilityAttributesURL = generateAccessibilityAttributesURL(accessibilityAttributesBaseURL, accessibilityAttributesappToken);
  const accessibilityAttributes = useSWR<any>(route.query.bbox ? () => accessibilityAttributesURL : null, fetchJSON);

  return (
    <FilterContext.Provider value={memoizedFilterContext}>
      <StyledMainContainer>
        <div>
          <SearchFilterDialog accessibilityAttributes={accessibilityAttributes} />
          <div ref={searchFiltersRef}>
            <SearchResults accessibilityAttributes={accessibilityAttributes} />
          </div>
        </div>
      </StyledMainContainer>
    </FilterContext.Provider>
  );
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <LayoutHealthPage>{page}</LayoutHealthPage>;
};
