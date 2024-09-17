import { MapRef } from 'react-map-gl'
import React, { useMemo, useState } from 'react'

export const GlobalMapContext = React.createContext<{ map: MapRef | null, setMapRef:(node: MapRef | null) => void }>({
  map: null,
  setMapRef: () => {
    throw new Error('setMapRef was not provided')
  },
})

export const GlobalMapContextProvider = ({ children }: { children?: React.ReactNode }) => {
  const [mapRef, setMapRef] = useState<MapRef | null>(null)

  const value = useMemo(() => ({ map: mapRef, setMapRef }), [mapRef, setMapRef])
  return (
    <GlobalMapContext.Provider value={value}>
      {children}
    </GlobalMapContext.Provider>
  )
}
