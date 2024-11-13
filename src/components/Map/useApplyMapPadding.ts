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

      // we might be triggered in a loop, check that the padding actually changed
      const padding = calculatePadding(map, mapOverlaps)
      const currentPadding = map.getPadding()
      if (typeof padding === 'number'
        ? padding === currentPadding.top
        && padding === currentPadding.bottom
        && padding === currentPadding.left
        && padding === currentPadding.right
        : padding.top === currentPadding.top
        && padding.bottom === currentPadding.bottom
        && padding.left === currentPadding.left
        && padding.right === currentPadding.right
      ) {
        return
      }

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
