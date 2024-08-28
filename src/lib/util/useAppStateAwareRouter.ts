import { useRouter, NextRouter } from 'next/router'
import {
  useCallback, useEffect, useMemo, useRef,
} from 'react'
import { useSearchParams } from 'next/navigation'
import { omitBy } from 'lodash'
import {
  AppStateSearchParams,
  parseQueryInput,
  parseSearchParams,
} from './AppStateSearchParams'
import getFeatureIdsFromLocation from '../model/geo/getFeatureIdsFromLocation'

type Url = Parameters<NextRouter['push']>[0]
type TransitionOptions = Parameters<NextRouter['push']>[2]

const undefinedTest = (value: unknown) => value === undefined

function mergeSearchParams(updated: AppStateSearchParams, previous?: AppStateSearchParams) {
  if (!previous) {
    return updated
  }

  const merged : AppStateSearchParams = structuredClone(updated)

  const hasExtent = updated.extent !== undefined
  const hasLatLon = updated.lat !== undefined && updated.lon !== undefined

  const shouldApplyLatLon = !hasExtent && previous.lat !== undefined && previous.lon !== undefined
  const shouldApplyExtent = !hasLatLon && previous.extent !== undefined

  if (hasExtent) {
    merged.extent = updated.extent
    delete merged.lat
    delete merged.lon
    delete merged.zoom
  } else if (shouldApplyLatLon) {
    merged.lat = previous.lat
    merged.lon = previous.lon
    merged.zoom = previous.zoom
    delete merged.extent
  } else if (shouldApplyExtent) {
    merged.extent = previous.extent
    delete merged.lat
    delete merged.lon
    delete merged.zoom
  }

  const shouldApplySearch = updated.searchQuery === undefined && previous.searchQuery !== undefined
  if (shouldApplySearch) {
    merged.searchQuery = previous.searchQuery
  }

  const shouldApplyCategory = updated.category === undefined && previous.category !== undefined
  if (shouldApplyCategory) {
    merged.category = previous.category
  }

  const shouldApplyAccessibility = updated.wheelchair === undefined && previous.wheelchair !== undefined
  if (shouldApplyAccessibility) {
    merged.wheelchair = previous.wheelchair
  }

  const shouldApplyToilet = updated.toilet === undefined && previous.toilet !== undefined
  if (shouldApplyToilet) {
    merged.toilet = previous.toilet
  }

  return omitBy(merged, undefinedTest) as AppStateSearchParams
}

export function preserveSearchParams(url: Url, previous?: AppStateSearchParams) : Url {
  let mergedSearchParams: AppStateSearchParams
  if (typeof url === 'string') {
    if (url.includes('://')) {
      return url
    }

    try {
      const parsedUrl = new URL(url, window.location.href)
      const updated = parseSearchParams(parsedUrl.searchParams)
      mergedSearchParams = mergeSearchParams(updated, previous)
      return {
        pathname: parsedUrl.pathname,
        query: mergedSearchParams,
        hash: parsedUrl.hash,
      }
    } catch (error) {
      mergedSearchParams = previous

      return {
        path: url,
        query: mergedSearchParams,
      }
    }
  }

  if (typeof url.query === 'object') {
    const updated = parseQueryInput(url.query)
    mergedSearchParams = mergeSearchParams(updated, previous)
  } else if (typeof url.query === 'string') {
    const updated = parseSearchParams(new URLSearchParams(url.query))
    mergedSearchParams = mergeSearchParams(updated, previous)
  }

  return {
    ...url,
    query: mergedSearchParams,
  }
}

export function useAppStateAwareRouter() {
  const nextRouter = useRouter()
  const searchParams = useSearchParams()
  const { push: nextPush, replace: nextReplace, pathname } = nextRouter

  const appStateSearchParams = parseSearchParams(searchParams)
  const appStateSearchParamsRef = useRef(appStateSearchParams)

  const featureIds = useMemo(() => getFeatureIdsFromLocation(pathname), [pathname])

  // useEffect for the appStateSearchParams, to keep the push/replace functions stable
  useEffect(() => {
    appStateSearchParamsRef.current = appStateSearchParams
  }, [appStateSearchParams, appStateSearchParamsRef])

  const push = useCallback((url: Url, as?: Url, options?: TransitionOptions) => {
    const preservedUrl = preserveSearchParams(url, appStateSearchParamsRef.current)
    return nextPush(preservedUrl, as, options)
  }, [nextPush])

  const replace = useCallback((url: Url, as?: Url, options?: TransitionOptions) => {
    const preservedUrl = preserveSearchParams(url, appStateSearchParamsRef.current)
    return nextReplace(preservedUrl, as, options)
  }, [nextReplace])

  return {
    nextRouter,
    searchParams: appStateSearchParams,
    featureIds,
    push,
    replace,
  }
}
