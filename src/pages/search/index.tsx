import Head from "next/head";
import { useCallback } from "react";
import { t } from "ttag";
import SearchPanel from "../../components/SearchPanel/SearchPanel";
import { useAppContext } from "../../lib/context/AppContext";

import { getProductTitle } from "../../lib/model/ac/ClientSideConfiguration";
import { getAccessibilityFilterFrom } from "../../lib/model/ac/filterAccessibility";

import { getLayout } from "../../components/App/MapLayout";
import { useMap } from "../../components/Map/useMap";
import { useEnrichedSearchResults } from "../../components/SearchPanel/useEnrichedSearchResults";
import type { YesNoUnknown } from "../../lib/model/ac/Feature";
import { useAppStateAwareRouter } from "../../lib/util/useAppStateAwareRouter";

export default function Page() {
  const router = useAppStateAwareRouter();
  const accessibilityFilter = getAccessibilityFilterFrom(
    router.searchParams.wheelchair,
  );
  const toiletFilter = getAccessibilityFilterFrom(
    router.searchParams.toilet,
  ) as YesNoUnknown[];
  const {
    category,
    q: searchQuery,
    lat: latFromUrl,
    lon: lonFromUrl,
  } = router.searchParams;

  const handleSearchQueryChange = useCallback(
    (newSearchQuery: string | undefined) => {
      router.replace(
        {
          query: {
            q:
              newSearchQuery && newSearchQuery.length > 0
                ? newSearchQuery
                : null,
            category: null,
            toilet: null,
            wheelchair: null,
          },
        },
        undefined,
        { shallow: true },
      );
    },
    [router],
  );

  const handleSearchPanelClick = useCallback(() => {}, []);

  const { map: canvasMap } = useMap();
  const closeSearchPanel = useCallback(() => {
    router.push(
      {
        pathname: "/",
      },
      undefined,
      { shallow: true },
    );
    canvasMap?.getCanvas().focus();
  }, [canvasMap, router]);

  const { clientSideConfiguration } = useAppContext();

  let searchTitle = "";
  if (searchQuery) {
    // translator: Search results window title
    searchTitle = t`Search results`;
  }

  const { map } = useMap();

  const lat = map?.getCenter().lat || latFromUrl;
  const lon = map?.getCenter().lng || lonFromUrl;
  const { searchResults, searchError, isSearching } = useEnrichedSearchResults(
    searchQuery,
    lat,
    lon,
  );

  return (
    <>
      <Head>
        <title key="title">
          {getProductTitle(clientSideConfiguration, searchTitle)}
        </title>
      </Head>

      <SearchPanel
        onClose={closeSearchPanel}
        onClick={handleSearchPanelClick}
        isExpanded
        accessibilityFilter={accessibilityFilter}
        toiletFilter={toiletFilter}
        hidden={false}
        inert={false}
        category={category}
        onChangeSearchQuery={handleSearchQueryChange}
        onSubmit={handleSearchQueryChange}
        minimalTopPosition={60}
        searchQuery={searchQuery}
        searchError={searchError}
        searchResults={searchResults}
        isSearching={isSearching}
      />
    </>
  );
}

Page.getLayout = getLayout;
