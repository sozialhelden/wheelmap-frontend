import { MapRef } from 'react-map-gl'
import { debounce } from 'lodash'

interface Rect {
  top: number,
  bottom: number,
  left: number,
  right: number,
}

// boolean operation on DOMRect, shrinks a by b
function subtractRect(a: Rect, b: Rect) {
  // there are four possible rects that can be created by subtracting b from a
  // calculate area of each and return the one with the largest remaining area
  const one = {
    top: a.top,
    bottom: a.bottom,
    left: a.left,
    right: b.left,
  }

  const two = {
    top: a.top,
    bottom: b.top,
    left: a.left,
    right: a.right,
  }

  const three = {
    top: a.top,
    bottom: a.bottom,
    left: b.right,
    right: a.right,
  }

  const four = {
    top: b.bottom,
    bottom: a.bottom,
    left: a.left,
    right: a.right,
  }

  const oneArea = one.bottom > one.top && one.right > one.left ? (one.bottom - one.top) * (one.right - one.left) : 0
  const twoArea = two.bottom > two.top && two.right > two.left ? (two.bottom - two.top) * (two.right - two.left) : 0
  const threeArea = three.bottom > three.top && three.right > three.left ? (three.bottom - three.top) * (three.right - three.left) : 0
  const fourArea = four.bottom > four.top && four.right > four.left ? (four.bottom - four.top) * (four.right - four.left) : 0

  const areas = [oneArea, twoArea, threeArea, fourArea]
  const maxArea = Math.max(...areas)

  if (maxArea <= 0) {
    return undefined
  }

  if (maxArea === oneArea) {
    return one
  }
  if (maxArea === twoArea) {
    return two
  }
  if (maxArea === threeArea) {
    return three
  }
  return four
}

export class MapOverlaps {
  private readonly overlapRegions = new Map<string, HTMLElement>()

  public readonly changeListeners = new Set<() => void>()

  readonly addOverlapRegion = (key: string, element: HTMLElement) => {
    if (this.overlapRegions.get(key) === element) {
      return
    }
    this.overlapRegions.set(key, element)
    this.notifyChange()
  }

  readonly removeOverlapRegion = (key: string) => {
    if (this.overlapRegions.delete(key)) {
      this.notifyChange()
    }
  }

  private readonly notifyChange = debounce(() => {
    for (const listener of this.changeListeners) {
      try {
        listener()
      } catch (e) {
        console.error('Error in change listener', e)
      }
    }
  }, 100)

  readonly collectPaddings = (map: MapRef, additionalPadding: number) => {
    const padding = {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    }

    const mapRect = map.getContainer().getBoundingClientRect()

    if (!mapRect || mapRect.width === 0 || mapRect.height === 0) {
      return additionalPadding
    }

    let remainingRect: Rect | undefined = mapRect
    for (const element of this.overlapRegions.values()) {
      const rect = element.getBoundingClientRect()

      if (!rect || rect.width === 0 || rect.height === 0) {
        continue
      }

      // degenerate case, ignore padding calculation
      if (!remainingRect) {
        console.warn('Degenerate case, ignoring padding calculation', { mapRect, overlapRegions: this.overlapRegions })
        return additionalPadding
      }

      remainingRect = subtractRect(remainingRect, rect)
    }

    if (remainingRect) {
      padding.top = remainingRect.top - mapRect.top + additionalPadding
      padding.bottom = mapRect.bottom - remainingRect.bottom + additionalPadding
      padding.left = remainingRect.left - mapRect.left + additionalPadding
      padding.right = mapRect.right - remainingRect.right + additionalPadding
    }

    return padding
  }
}

export function calculateDefaultPadding() {
  return Math.min(Math.max(Math.max(window.innerWidth / 10, window.innerHeight / 10), 20), 80)
}

export function calculatePadding(map: MapRef | null, mapOverlaps: MapOverlaps) {
  const defaultPadding = calculateDefaultPadding()

  if (!map) {
    return defaultPadding
  }

  return mapOverlaps.collectPaddings(map, defaultPadding)
}
