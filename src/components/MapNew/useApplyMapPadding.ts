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

      const padding = calculatePadding(map, mapOverlaps)
      if (!map.isEasing() && !map.isMoving()) {
        map.easeTo({
          padding,
          duration: 500,
        })
      }
    }
    mapOverlaps.changeListeners.add(listener)

    return () => {
      mapOverlaps.changeListeners.delete(listener)
    }
  }, [map, mapOverlaps])
}
