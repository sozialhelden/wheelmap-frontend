import Head from 'next/head'
import { ReactElement, useCallback, useContext } from 'react'
import useSWR from 'swr'
import { t } from 'ttag'
import MapLayout from '../../components/App/MapLayout'
import SearchPanel from '../../components/SearchPanel/SearchPanel'
import { AppContext } from '../../lib/context/AppContext'

import { getProductTitle } from '../../lib/model/ac/ClientSideConfiguration'
import { getAccessibilityFilterFrom } from '../../lib/model/ac/filterAccessibility'
import {
  AnyFeature,
  AnyFeatureCollection,
  TypeTaggedSearchResultFeature,
} from '../../lib/model/geo/AnyFeature'
import { SearchResultFeature } from '../../lib/fetchers/ac/refactor-this/fetchPlaceSearchResults'
import fetchPlacesOnKomootPhoton, { SearchResultCollection } from '../../lib/fetchers/fetchPlacesOnKomootPhoton'
import { YesNoUnknown } from '../../lib/model/ac/Feature'
import { CategoryLookupTables } from '../../lib/model/ac/categories/Categories'
import { useAppStateAwareRouter } from '../../lib/util/useAppStateAwareRouter'

export default function Page() {
  const router = useAppStateAwareRouter()
  const accessibilityFilter = getAccessibilityFilterFrom(router.searchParams.wheelchair)
  const toiletFilter = getAccessibilityFilterFrom(router.searchParams.toilet) as YesNoUnknown[]
  const { category, q: searchQuery } = router.searchParams

  // TODO: Load this correctly via SWR
  const categories: CategoryLookupTables = {
    synonymCache: undefined,
    categories: [],
  }

  const handleSearchQueryChange = useCallback(
    (newSearchQuery: string | undefined) => {
      router.replace({
        query: {
          q: newSearchQuery && newSearchQuery.length > 0 ? newSearchQuery : null,
          category: null,
          toilet: null,
          wheelchair: null,
        },
      })
    },
    [router],
  )

  const handlePlaceFilterChange = useCallback(
    (newPlaceFilter) => {
      router.replace({
        query: {
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
  } = useSWR({ query: searchQuery }, fetchPlacesOnKomootPhoton)

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
  return <MapLayout>{page}</MapLayout>
}
