// if (this.mainView) this.mainView.focusSearchPanel();

// onSearchResultClick = (feature: SearchResultFeature, wheelmapFeature: PlaceInfo | null) => {
//   const params = this.getCurrentParams() as any;
//   let routeName = 'map';

//   if (wheelmapFeature) {
//     let id = getFeatureId(wheelmapFeature);
//     if (id) {
//       params.id = id;
//       delete params.eid;
//       routeName = 'placeDetail';
//     }
//   }

//   if (routeName === 'map') {
//     delete params.id;
//     delete params.eid;
//   }

//   if (feature.properties.extent) {
//     const extent = feature.properties.extent;
//     this.setState({ lat: null, lon: null, extent });
//   } else {
//     const [lon, lat] = feature.geometry.coordinates;
//     this.setState({ lat, lon, extent: null });
//   }

//   this.props.routerHistory.push(routeName, params);
// };

import { useRouter } from "next/router";
import React, { useCallback } from "react";
import Layout from "../../components/App/Layout";
import SearchPanel from "../../components/SearchPanel/SearchPanel";
import { getAccessibilityFilterFrom } from "../../lib/model/filterAccessibility";
import { SearchResultCollection } from "../../lib/searchPlaces";

const SearchPage = () => {
  const router = useRouter();
  const accessibilityFilter = getAccessibilityFilterFrom(
    router.query.wheelchair
  );
  const toiletFilter = getAccessibilityFilterFrom(router.query.toilet);
  const category = router.query.category;
  const searchQuery = router.query.q && String(router.query.q);
  // TODO: Load this correctly via SWR
  const categories = {
    synonymCache: {},
    categoryTree: [],
  };

  const handleSearchQueryChange = useCallback(
    (newSearchQuery) => {
      router.replace({
        pathname: router.pathname,
        query: { ...router.query, q: newSearchQuery },
      });
    },
    [router]
  );

  const handlePlaceFilterChange = useCallback(
    (newPlaceFilter) => {
      router.replace({
        pathname: router.pathname,
        query: {
          ...router.query,
          wheelchair: newPlaceFilter.accessibility,
          toilet: newPlaceFilter.toilet,
        },
      });
    },
    [router]
  );

  const handleSearchPanelClick = useCallback(() => {}, []);

  const closeSearchPanel = useCallback(() => {
    router.push({
      pathname: "/",
      query: { ...router.query },
    });
  }, [router]);

  return (
    <Layout>
      <SearchPanel
        onClose={closeSearchPanel}
        onClick={handleSearchPanelClick}
        isExpanded={true}
        hasGoButton={false}
        accessibilityFilter={accessibilityFilter}
        toiletFilter={toiletFilter}
        categories={categories}
        hidden={false}
        inert={false}
        category={undefined}
        searchQuery={searchQuery}
        onChangeSearchQuery={handleSearchQueryChange}
        onSubmit={handleSearchQueryChange}
        onAccessibilityFilterButtonClick={handlePlaceFilterChange}
        searchResults={undefined}
        minimalTopPosition={60}
      />
    </Layout>
  );
};

export default SearchPage;
