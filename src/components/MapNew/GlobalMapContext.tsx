import { MapRef } from 'react-map-gl'
import React, {
  useCallback, useId, useMemo, useState,
} from 'react'
import { calculatePadding, MapOverlaps } from './MapOverlapPadding'

const mapOverlaps = new MapOverlaps()

export interface GlobalMapContextValue {
  map: MapRef | null,
  setMapRef:(node: MapRef | null) => void
  calculatePadding: () => (number | { top: number, bottom: number, left: number, right: number })
}

export const GlobalMapContext = React.createContext<GlobalMapContextValue>({
  map: null,
  setMapRef: () => {
    throw new Error('setMapRef was not provided')
  },
  calculatePadding: () => {
    throw new Error('calculatePadding was not provided')
  },
})

export const GlobalMapContextProvider = ({ children }: { children?: React.ReactNode }) => {
  // this will not change frequently, thus we need not to be afraid of re-rendering
  const [mapRef, setMapRef] = useState<MapRef | null>(null)

  const value = useMemo(() => ({
    map: mapRef,
    setMapRef,
    calculatePadding: () => calculatePadding(mapRef, mapOverlaps),
  }
  ), [mapRef, setMapRef])

  return (
    <GlobalMapContext.Provider value={value}>
      {children}
    </GlobalMapContext.Provider>
  )
}

export const useMapOverlapRef = (isActive: boolean = true) => {
  const key = useId()

  const setRef = useCallback((element: HTMLElement | null) => {
    if (element) {
      mapOverlaps.addOverlapRegion(key, element)
    } else {
      mapOverlaps.removeOverlapRegion(key)
    }
  }, [key])

  return isActive ? setRef : undefined
}
