import { ParsedUrlQuery } from 'querystring'
import {
  useCallback, useMemo, useRef, useState,
} from 'react'
import { ViewState } from 'react-map-gl'
import { useMap } from './useMap'

const localStorageLocation = 'wheelmap.location' as const
type MapLocation = { type: 'position', latitude: number, longitude: number, zoom: number }
const getInitialMapLocation = (query: ParsedUrlQuery): MapLocation => {
  const latitude = typeof query.lat === 'string' ? query.lat : undefined
  const longitude = typeof query.lon === 'string' ? query.lon : undefined
  const zoom = typeof query.zoom === 'string' ? query.zoom : undefined
  // query contains lat/lon
  if (latitude && longitude) {
    return {
      type: 'position',
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      zoom: parseFloat(zoom ?? '18'),
    }
  }

  const localStorageValue = localStorage.getItem(localStorageLocation)
  if (localStorageValue) {
    return JSON.parse(localStorageValue) as MapLocation
  }

  return {
    type: 'position',
    latitude: 52.5,
    longitude: 13.3,
    zoom: 10,
  }
}

const saveMapLocation = (location: MapLocation) => {
  localStorage.setItem(localStorageLocation, JSON.stringify(location))
}

type TrackedViewportState = Pick<ViewState, 'latitude' | 'longitude' | 'zoom'> & { width: number, height: number }

export const useMapViewInternals = (query: ParsedUrlQuery) => {
  const { map, setMapRef } = useMap()

  const { latitude, longitude, zoom } = getInitialMapLocation(query)
  const [viewport, setViewportInternal] = useState<TrackedViewportState>({
    width: 100,
    height: 100,
    latitude,
    longitude,
    zoom,
  })

  const lastViewPortRef = useRef<TrackedViewportState>(viewport)

  const setViewport = useCallback((newViewPort: Partial<TrackedViewportState>) => {
    // store the new location in local storage
    saveMapLocation({
      type: 'position',
      latitude: newViewPort.latitude ?? lastViewPortRef.current.latitude,
      longitude: newViewPort.longitude ?? lastViewPortRef.current.longitude,
      zoom: newViewPort.zoom ?? lastViewPortRef.current.zoom,
    })
    // update the viewport infos
    lastViewPortRef.current = { ...lastViewPortRef.current, ...newViewPort }
    setViewportInternal(lastViewPortRef.current)
  }, [setViewportInternal])

  return useMemo(() => ({
    map,
    setMapRef,
    // don't want to expose internals of viewport management to all other consumers of `useMap`
    initialViewport: viewport,
    onViewportUpdate: setViewport,
  }), [map, setMapRef, viewport, setViewport])
}
