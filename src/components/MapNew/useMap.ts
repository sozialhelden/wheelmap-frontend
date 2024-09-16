import { useCallback, useMemo, useState } from 'react'
import { MapRef } from 'react-map-gl'

export const useMap = () => {
  const [mapRef, setMapRefInternal] = useState<MapRef | null>(null)
  const setMapRef = useCallback((node: MapRef | null) => {
    setMapRefInternal(node)
  }, [setMapRefInternal])

  return useMemo(() => ({ map: mapRef, setMapRef }), [mapRef, setMapRef])
}
