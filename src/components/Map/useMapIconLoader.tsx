import { FunctionComponent, useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'
import { MapEvent } from 'react-map-gl'
import { Map as MapBoxMap } from 'mapbox-gl'
import * as categoryIcons from '../icons/categories'
import { log } from '../../lib/util/logger'
import * as markerIcons from '../icons/markers'
import ColoredIconMarker from './ColoredIconMarker'

type IconMap = {
  [name: string]: FunctionComponent;
}

const renderCache = new Map<string, string>()
const imageCache = new Map<string, HTMLImageElement>()

function loadIcon(map: MapBoxMap, icons: IconMap, iconName: string, options: { fill?: string; addShadow?: boolean, suffix?: string, iconSize?: number } = {}): void {
  const finalIconName = `${iconName}${options?.suffix ?? ''}`

  if (map.hasImage(finalIconName)) {
    return
  }

  let dataUrl = renderCache.get(finalIconName)
  const wasInCache = !!dataUrl
  if (!dataUrl) {
    const div = document.createElement('div')
    const root = createRoot(div)
    flushSync(() => {
      const [categoryIconName, accessibilityGrade] = finalIconName.split('-')
      const IconComponent = (categoryIconName && accessibilityGrade) ? icons[categoryIconName] : icons[iconName]
      const element = accessibilityGrade ? (
        <ColoredIconMarker accessibilityGrade={accessibilityGrade}>
          <IconComponent />
        </ColoredIconMarker>
      ) : <IconComponent />
      root.render(element)
    })
    const svgElement = div.querySelector('svg')
    if (!svgElement) {
      console.warn('Could not find svg element in icon', finalIconName)
      return
    }

    svgElement.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', 'http://www.w3.org/2000/svg')
    const graphicalElements = svgElement.querySelectorAll('path, rect, circle, ellipse, line, polyline, polygon')
    // set fill to e.g. white for all elements
    const iconElement = svgElement.querySelector('svg > svg')
    iconElement?.setAttribute('x', '4.5')
    iconElement?.setAttribute('y', '4.5')
    if (options?.iconSize) {
      iconElement?.setAttribute('transform', `scale(${options.iconSize}, ${options.iconSize})`)
    }
    if (options?.fill) {
      const filledElements = iconElement.querySelectorAll('path, rect, circle, ellipse, line, polyline, polygon')
      for (const e of filledElements) {
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

export function loadIconsInMapInstance(mapInstance: MapBoxMap): void {
  for (const iconName of Object.keys(categoryIcons)) {
    for (const accessibilityGrade of ['yes', 'no', 'limited']) {
      loadIcon(
        mapInstance,
        categoryIcons,
        iconName,
        {
          fill: 'white',
          addShadow: true,
          suffix: `-${accessibilityGrade}`,
        },
      )
    }
    loadIcon(
      mapInstance,
      categoryIcons,
      iconName,
      {
        fill: '#666',
        addShadow: true,
        suffix: '-unknown',
        iconSize: 0.8,
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
}
