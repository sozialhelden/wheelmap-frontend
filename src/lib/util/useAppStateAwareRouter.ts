import { useRouter, NextRouter } from 'next/router'
import {
  useCallback, useEffect, useMemo, useRef,
} from 'react'
import { useSearchParams } from 'next/navigation'
import { omitBy } from 'lodash'
import { ParsedUrlQuery } from 'querystring'
import {
  AppStateSearchParams, parseQuery,
  parseQueryInput,
  parseSearchParams,
} from './AppStateSearchParams'
import getFeatureIdsFromLocation from '../model/geo/getFeatureIdsFromLocation'
import { getAccessibilityFilterFrom } from '../model/ac/filterAccessibility'
import { YesNoUnknown } from '../model/ac/Feature'

type Url = Parameters<NextRouter['push']>[0]
type TransitionOptions = Parameters<NextRouter['push']>[2]

const testForEmptyValues = (value: unknown) => value === undefined || value === null

function mergeSearchParams(updated: AppStateSearchParams, previous?: AppStateSearchParams) {
  if (!previous) {
    return updated
  }

  const merged : AppStateSearchParams = structuredClone(updated)

  const shouldPreserveSearch = updated.q === undefined && previous.q !== undefined
  if (shouldPreserveSearch) {
    merged.q = previous.q
  }

  const shouldPreserveCategory = updated.category === undefined && previous.category !== undefined
  if (shouldPreserveCategory) {
    merged.category = previous.category
  }

  const shouldPreserveAccessibility = updated.wheelchair === undefined && previous.wheelchair !== undefined
  if (shouldPreserveAccessibility) {
    merged.wheelchair = previous.wheelchair
  }

  const shouldPreserveToilet = updated.toilet === undefined && previous.toilet !== undefined
  if (shouldPreserveToilet) {
    merged.toilet = previous.toilet
  }

  return omitBy(merged, testForEmptyValues) as AppStateSearchParams
}

function combineSearchParams(searchParams: AppStateSearchParams) {
  return new URLSearchParams(searchParams as Record<string, string>).toString()
}

export function preserveSearchParams(url: Url, previous?: AppStateSearchParams, query?: ParsedUrlQuery) : Url {
  if (typeof url === 'string') {
    if (url.includes('://')) {
      return url
    }

    if (!global.window) {
      return {
        path: url,
        search: previous ? combineSearchParams(previous) : undefined,
      }
    }

    try {
      const parsedUrl = new URL(url, window.location.href)
      const updated = parseSearchParams(parsedUrl.searchParams)
      const mergedSearchParams = mergeSearchParams(updated, previous)

      return {
        pathname: parsedUrl.pathname,
        search: combineSearchParams(mergedSearchParams),
        hash: parsedUrl.hash,
      }
    } catch (error) {
      console.error('preserveSearchParams failed to parse URL', { url, error })
      return {
        path: url,
        search: previous ? combineSearchParams(previous) : undefined,
      }
    }
  }

  const updatedUrl = { ...url }

  if (typeof url.query === 'object' && url.query) {
    const mergedSearchParams = mergeSearchParams(parseQueryInput(url.query), previous)
    // we need to ensure that the old query is preserved, as it might contain [id] or other dynamic parts
    updatedUrl.query = {
      ...query,
      ...url.query,
      ...mergedSearchParams,
    }
  } else if (typeof url.query === 'string') {
    const mergedSearchParams = parseSearchParams(new URLSearchParams(url.query))
    updatedUrl.search = combineSearchParams(mergeSearchParams(mergedSearchParams, previous))
  }

  return updatedUrl
}

const emptySearchParams: AppStateSearchParams = { }

export function useAppStateAwareRouter() {
  const nextRouter = useRouter()
  const {
    push: nextPush, replace: nextReplace, pathname, query,
  } = nextRouter

  const appStateSearchParams = query ? parseQuery(query) : emptySearchParams
  const appStateSearchParamsRef = useRef(appStateSearchParams)
  const queryRef = useRef(query)

  // derive some values from the AppStateSearchParams
  const featureIds = useMemo(() => getFeatureIdsFromLocation(pathname), [pathname])
  const accessibilityFilter = useMemo(() => getAccessibilityFilterFrom(appStateSearchParams.wheelchair), [appStateSearchParams.wheelchair])
  const toiletFilter = useMemo(() => getAccessibilityFilterFrom(appStateSearchParams.toilet) as YesNoUnknown[], [appStateSearchParams.toilet])

  // useEffect for the appStateSearchParams, to keep the push/replace functions stable
  useEffect(() => {
    queryRef.current = query
    appStateSearchParamsRef.current = query ? parseQuery(query) : emptySearchParams
  }, [query])

  const push = useCallback((url: Url, as?: Url, options?: TransitionOptions) => {
    const preservedUrl = preserveSearchParams(url, appStateSearchParamsRef.current, queryRef.current)
    return nextPush(preservedUrl, as, options)
  }, [nextPush])

  const replace = useCallback((url: Url, as?: Url, options?: TransitionOptions) => {
    const preservedUrl = preserveSearchParams(url, appStateSearchParamsRef.current, queryRef.current)
    return nextReplace(preservedUrl, as, options)
  }, [nextReplace])

  return {
    nextRouter,
    pathname,
    query,
    searchParams: appStateSearchParams,
    featureIds,
    accessibilityFilter,
    toiletFilter,
    push,
    replace,
  }
}