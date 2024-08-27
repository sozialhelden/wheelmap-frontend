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

import { omit } from 'lodash'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactElement, useCallback, useContext } from 'react'
import useSWR from 'swr'
import { t } from 'ttag'
import Layout from '../../components/App/Layout'
import SearchPanel from '../../components/SearchPanel/SearchPanel'
import { AppContext } from '../../lib/context/AppContext'
import fetchPlaceSearchResults, {
  SearchResultCollection,
  SearchResultFeature,
} from '../../lib/fetchers/fetchPlaceSearchResults'
import { getProductTitle } from '../../lib/model/ac/ClientSideConfiguration'
import { getAccessibilityFilterFrom } from '../../lib/model/ac/filterAccessibility'
import {
  AnyFeature,
  AnyFeatureCollection,
  TypeTaggedSearchResultFeature,
} from '../../lib/model/geo/AnyFeature'

export default function Page() {
  const router = useRouter()
  const accessibilityFilter = getAccessibilityFilterFrom(
    router.query.wheelchair,
  )
  const toiletFilter = getAccessibilityFilterFrom(router.query.toilet)
  const category = router.query.category
    ? String(router.query.category)
    : undefined
  const searchQuery = router.query.q && String(router.query.q)
  // TODO: Load this correctly via SWR
  const categories = {
    synonymCache: {},
    categoryTree: [],
  }

  const handleSearchQueryChange = useCallback(
    (newSearchQuery) => {
      const query = omit(router.query, 'q', 'category', 'toilet', 'wheelchair')
      if (newSearchQuery && newSearchQuery.length > 0) {
        query.q = newSearchQuery
      }
      router.replace({
        pathname: router.pathname,
        query,
      })
    },
    [router],
  )

  const handlePlaceFilterChange = useCallback(
    (newPlaceFilter) => {
      router.replace({
        pathname: router.pathname,
        query: {
          ...router.query,
          wheelchair: newPlaceFilter.accessibility,
          toilet: newPlaceFilter.toilet,
        },
      })
    },
    [router],
  )

  const handleSearchPanelClick = useCallback(() => {}, [])

  const closeSearchPanel = useCallback(() => {
    router.push({
      pathname: '/',
      query: { ...router.query },
    })
  }, [router])

  const { clientSideConfiguration } = useContext(AppContext)

  let searchTitle
  if (searchQuery) {
    // translator: Search results window title
    searchTitle = t`Search results`
  }

  const {
    data: searchResults,
    isValidating: isSearching,
    error: searchError,
  } = useSWR([searchQuery, undefined, undefined], fetchPlaceSearchResults)

  function toTypeTaggedSearchResults(
    col: SearchResultCollection,
  ): AnyFeatureCollection {
    // returns the col.features array with the type tag added to each feature
    return {
      features: col.features.map(
        (feature: SearchResultFeature | AnyFeature) => ({
          '@type': 'komoot:SearchResult',
          ...feature,
        } as TypeTaggedSearchResultFeature),
      ),
    }
  }

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
        hasGoButton={false}
        accessibilityFilter={accessibilityFilter}
        toiletFilter={toiletFilter}
        categories={categories}
        hidden={false}
        inert={false}
        category={category}
        onChangeSearchQuery={handleSearchQueryChange}
        onSubmit={handleSearchQueryChange}
        onAccessibilityFilterButtonClick={handlePlaceFilterChange}
        minimalTopPosition={60}
        searchQuery={searchQuery}
        searchError={searchError}
        searchResults={
          searchResults
            ? toTypeTaggedSearchResults(searchResults)
            : searchResults
        }
        isSearching={isSearching}
      />
    </>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
