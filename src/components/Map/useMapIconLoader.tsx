import { FunctionComponent, useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'
import { MapEvent } from 'react-map-gl'
import { Map as MapBoxMap } from 'mapbox-gl'
import * as categoryIcons from '../icons/categories'
import { log } from '../../lib/util/logger'
import * as markerIcons from '../icons/markers'

type IconMap = {
  [name: string]: FunctionComponent;
}

const renderCache = new Map<string, string>()
const imageCache = new Map<string, HTMLImageElement>()

function loadIcon(map: MapBoxMap, icons: IconMap, iconName: string, options: { fill?: string; addShadow?: boolean, suffix?: string } = {}): void {
  const finalIconName = `${iconName}${options?.suffix ?? ''}`

  if (map.hasImage(finalIconName)) {
    return
  }

  let dataUrl = renderCache.get(finalIconName)
  const wasInCache = !!dataUrl
  if (!dataUrl) {
    const IconComponent = icons[iconName]
    const div = document.createElement('div')
    const root = createRoot(div)
    flushSync(() => {
      root.render(<IconComponent />)
    })
    const svgElement = div.querySelector('svg')
    if (!svgElement) {
      console.warn('Could not find svg element in icon', iconName)
      return
    }

    svgElement.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', 'http://www.w3.org/2000/svg')
    const graphicalElements = svgElement.querySelectorAll('path, rect, circle, ellipse, line, polyline, polygon')
    // set fill to e.g. white for all elements
    if (options?.fill) {
      for (const e of graphicalElements) {
        e.setAttribute('fill', options.fill)
      }
    }

    if (options.addShadow) {
      // add a shadow to all elements
      graphicalElements.forEach((e) => e.setAttribute('filter', 'url(#shadow)'))
      // add the shadow filter
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
      const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter')
      filter.setAttribute('id', 'shadow')
      const feDropShadow = document.createElementNS('http://www.w3.org/2000/svg', 'feDropShadow')
      feDropShadow.setAttribute('dx', '0')
      feDropShadow.setAttribute('dy', '0')
      feDropShadow.setAttribute('stdDeviation', '0.5')
      feDropShadow.setAttribute('flood-color', 'black')
      feDropShadow.setAttribute('flood-opacity', '0.9')
      filter.appendChild(feDropShadow)
      defs.appendChild(filter)
      svgElement.appendChild(defs)
    }

    const svg = div.innerHTML
    dataUrl = `data:image/svg+xml;base64,${btoa(svg)}`
    renderCache.set(finalIconName, dataUrl)
    root.unmount()
    div.innerHTML = ''
  }

  const existingImage = imageCache.get(finalIconName)
  if (existingImage) {
    map.addImage(finalIconName, existingImage, { pixelRatio: 4 })
  } else {
    const customIcon = new Image(60, 60)
    customIcon.onload = () => {
      if (!wasInCache) {
        console.log('adding icon', `${finalIconName}`)
      }
      imageCache.set(finalIconName, customIcon)
      map.addImage(finalIconName, customIcon, { pixelRatio: 4 })
    }
    customIcon.onerror = () => {
      if (!wasInCache) {
        console.log('error loading icon', iconName, dataUrl)
      }
    }

    customIcon.src = dataUrl
  }
}

export function useMapIconLoader() {
  const onLoadCallback = useCallback((e: MapEvent) => {
    console.log('onLoadCallback was changed!')
    const mapInstance = e.target

    if (!mapInstance) {
      log.warn('Expected a map instance but got nothing')
      return
    }

    for (const iconName of Object.keys(categoryIcons)) {
      loadIcon(
        mapInstance,
        categoryIcons,
        iconName,
        {
          fill: 'white',
          addShadow: true,
          suffix: '-15-white',
        },
      )
    }

    for (const iconName of Object.keys(markerIcons)) {
      loadIcon(
        mapInstance,
        markerIcons,
        iconName,
      )
    }
  }, [])

  return {
    onLoadCallback,
  }
}
