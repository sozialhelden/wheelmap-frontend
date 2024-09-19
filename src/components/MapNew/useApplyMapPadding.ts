import { useContext, useEffect } from 'react'
import { GlobalMapContext } from './GlobalMapContext'
import { calculatePadding } from './MapOverlapPadding'

export function useApplyMapPadding() {
  const { map, mapOverlaps } = useContext(GlobalMapContext)

  useEffect(() => {
    const listener = () => {
      if (!map) {
        return
      }

      map.off('moveend', listener)

      const padding = calculatePadding(map, mapOverlaps)
      if (map.isEasing() || map.isMoving()) {
        map.once('moveend', listener)
        return
      }

      map.easeTo({
        padding,
        duration: 500,
      })
    }
    mapOverlaps.changeListeners.add(listener)

    return () => {
      map?.off('moveend', listener)
      mapOverlaps.changeListeners.delete(listener)
    }
  }, [map, mapOverlaps])
}
