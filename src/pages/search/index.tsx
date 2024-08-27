import { omit } from 'lodash'
import Head from 'next/head'
import { useRouter } from 'next/router'
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

export default function Page() {
  const router = useRouter()
  const accessibilityFilter = getAccessibilityFilterFrom(
    router.query.wheelchair,
  )
  const toiletFilter = getAccessibilityFilterFrom(router.query.toilet) as YesNoUnknown[]
  const category = router.query.category
    ? String(router.query.category)
    : undefined
  const searchQuery = router.query.q && String(router.query.q)

  // TODO: Load this correctly via SWR
  const categories: CategoryLookupTables = {
    synonymCache: undefined,
    categories: [],
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
