import { FunctionComponent, useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'
import { MapRef } from 'react-map-gl'
import { Map } from 'mapbox-gl'
import * as categoryIcons from '../icons/categories'
import { log } from '../../lib/util/logger'
import * as markerIcons from '../icons/markers'

type IconMap = {
  [name: string]: FunctionComponent;
}

function loadIcon(map: Map, icons: IconMap, iconName: string, options: { fill?: string; addShadow?: boolean, suffix?: string } = {}): void {
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
  const dataUrl = `data:image/svg+xml;base64,${btoa(svg)}`

  // let blob = new Blob([svg], {type: 'image/svg+xml'});
  // let url = URL.createObjectURL(blob);
  const customIcon = new Image(60, 60)
  customIcon.onload = () => {
    const finalIconName = `${iconName}${options?.suffix ?? ''}`
    console.log('adding icon', `${finalIconName}`)
    map.addImage(finalIconName, customIcon, { pixelRatio: 4 })
  }
  customIcon.onerror = () => {
    console.log('error loading icon', iconName, dataUrl)
  }
  customIcon.src = dataUrl
}

export function useMapIconLoader(map: MapRef | null) {
  const onLoadCallback = useCallback(() => {
    const mapInstance = map?.getMap?.()

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
          suffix: '-white',
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
  }, [map])

  return {
    onLoadCallback,
  }
}
