import mapboxgl, { MapLayerMouseEvent, MapLayerTouchEvent } from 'mapbox-gl'
import * as React from 'react'
import {
  useCallback, useLayoutEffect, useState,
} from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import {
  Map,
  MapProvider,
  NavigationControl,
  Source,
  ViewStateChangeEvent,
} from 'react-map-gl'

// import FeatureListPopup from "../feature/FeatureListPopup";
import { useHotkeys } from '@blueprintjs/core'
import MapboxLanguage from '@mapbox/mapbox-gl-language'
import { uniq } from 'lodash'
import 'mapbox-gl/dist/mapbox-gl.css'
import { createGlobalStyle } from 'styled-components'
import { t } from 'ttag'
import getFeatureIdsFromLocation from '../../lib/model/geo/getFeatureIdsFromLocation'
import { FixedHelpButton } from '../CombinedFeaturePanel/components/HelpButton'
import * as categoryIcons from '../icons/categories'
import { databaseTableNames, filterLayers } from './filterLayers'
import useMapStyle from './useMapStyle'
import { useEnvContext } from '../../lib/context/EnvContext'
import { StyledLoadingIndicator } from './LoadingIndictor'

import { log } from '../../lib/util/logger'
import { useMapViewInternals } from './useMapInternals'
import { uriFriendlyPosition } from './utils'
import { GeolocateButton } from './GeolocateButton'
import { MapLayer } from './MapLayer'
import { useAppStateAwareRouter } from '../../lib/util/useAppStateAwareRouter'
import { useApplyMapPadding } from './useApplyMapPadding'

// The following is required to stop "npm build" from transpiling mapbox code.
// notice the exclamation point in the import.
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default

interface IProps {
  featureId?: string;
  timestamp?: number;
  visible?: boolean;
  width: number;
  height: number;
}

const MapboxExtraStyles = createGlobalStyle`
  .mapboxgl-ctrl-top-left, .mapboxgl-ctrl-top-right {
    top: 56px;
  }

  .mapboxgl-ctrl-top-left {
    left: 4px;
  }
  .mapboxgl-ctrl-top-right {
    right: 4px;
  }

  .mapboxgl-map button:not(.mapboxgl-ctrl-attrib-button) {
    min-width: 44px;
    min-height: 44px;
  }
`

export default function MapView(props: IProps) {
  const router = useAppStateAwareRouter()
  const featureIds = getFeatureIdsFromLocation(router.pathname)

  const { width, height } = props
  const { query } = router
  const {
    setMapRef, initialViewport, onViewportUpdate, map, saveMapLocation,
  } = useMapViewInternals(query)

  // Reset viewport when map size changes
  useLayoutEffect(() => {
    const newViewport = { ...initialViewport, width, height }
    onViewportUpdate(newViewport)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height])

  useApplyMapPadding()

  React.useEffect(() => {
    if (['unavailable', 'error'].includes(mapboxgl.getRTLTextPluginStatus())) {
      mapboxgl.setRTLTextPlugin(
        'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
        (error) => { log.error(error) },
        true, // Lazy load the plugin
      )
    }
    const language = new MapboxLanguage()
    map?.getMap?.().addControl(language)
  }, [map])

  // const featureLayer = React.useMemo(() => {
  //   return generateSelectedFeatureLayer(props.featureId);
  // }, [props.featureId]);

  // const featureDetailsLayer = useMemo(() => {
  //   return generateFeatureDetailsLayer(props.featureId);
  // }, [props.featureId]);

  // const unclusteredPointLabelLayer = useMemo(() => {
  //   return generateUnclusteredPointLabelLayer(lastImportType, languageTagsStrings, props.featureId);
  // }, [lastImportType, props.featureId]);

  const updateViewportQuery = useCallback(({ longitude: lon, latitude: lat, zoom: z }:
  { longitude: number, latitude: number, zoom: number }) => {
    const newQuery: { lon?: string, lat?: string, zoom?: string } = { }
    const { zoom, latitude, longitude } = uriFriendlyPosition({
      latitude: lat,
      longitude: lon,
      zoom: z,
    })
    newQuery.zoom = zoom
    if (featureIds.length === 0) {
      newQuery.lat = latitude
      newQuery.lon = longitude
    }
    // update the initial viewport (and the local storage)
    saveMapLocation({
      type: 'position', latitude: lat, longitude: lon, zoom: z,
    })
    router.replace({ query: newQuery })
  }, [featureIds.length, saveMapLocation, router])

  const onViewStateChange = useCallback((evt: ViewStateChangeEvent) => {
    updateViewportQuery({ longitude: evt.viewState.longitude, latitude: evt.viewState.latitude, zoom: evt.viewState.zoom })
  }, [updateViewportQuery])

  const onMouseClick = useCallback((evt: MapLayerMouseEvent | MapLayerTouchEvent) => {
    const features = evt.features ?? []
    if (features.length <= 0) {
      updateViewportQuery({
        latitude: evt.lngLat.lat, longitude: evt.lngLat.lng, zoom: initialViewport.zoom,
      })
      router.replace('/')
      return
    }
    const { latitude, longitude, zoom } = uriFriendlyPosition({
      latitude: evt.target.getCenter().lat,
      longitude: evt.target.getCenter().lng,
      zoom: evt.target.getZoom(),
    })

    if (features.length === 1) {
      const feature = features[0]
      router.push(
        `/${feature.source}/${feature.properties?.id?.replace('/', ':')}?lon=${longitude}&lat=${latitude}&zoom=${zoom}`,
      )
      return
    }
    router.push(
      `/composite/${uniq(features.map((f) => [f.source, f.properties?.id?.replace('/', ':')].join(':')))
        .join(',')}?lon=${longitude}&lat=${latitude}&zoom=${zoom}`,
    )
  }, [router, updateViewportQuery, initialViewport.zoom])

  const onLoadCallback = useCallback(() => {
    const mapInstance = map?.getMap?.()
    if (!mapInstance) {
      log.warn('Expected a map instance but got nothing')
      return
    }
    Object.keys(categoryIcons).forEach((iconName) => {
      const CategoryIconComponent = categoryIcons[iconName]
      const div = document.createElement('div')
      const root = createRoot(div)
      flushSync(() => {
        root.render(<CategoryIconComponent />)
      })
      const svgElement = div.querySelector('svg')
      if (!svgElement) {
        throw new Error('Expected an SVG element, but node creation apparently failed')
      }
      svgElement.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns', 'http://www.w3.org/2000/svg')
      const graphicalElements = svgElement.querySelectorAll('path, rect, circle, ellipse, line, polyline, polygon')
      // set fill to white for all elements
      graphicalElements.forEach((e) => e.setAttribute('fill', 'white'))
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

      const svg = div.innerHTML
      const dataUrl = `data:image/svg+xml;base64,${btoa(svg)}`
      const customIcon = new Image(30, 30)
      customIcon.onload = () => {
        // log.debug('adding icon', `${iconName}-15-white`)
        mapInstance.addImage(`${iconName}-15-white`, customIcon, { pixelRatio: 2 })
      }
      customIcon.onerror = () => {
        log.warn('error loading icon', iconName, dataUrl)
      }
      customIcon.src = dataUrl
    })
  }, [map])

  const mapStyle = useMapStyle()

  const [hasBuildings, setHasBuildings] = useState(true)
  const [hasPublicTransport, setHasPublicTransport] = useState(false)
  const [hasSurfaces, setHasSurfaces] = useState(true)

  const hotkeys = React.useMemo(() => [
    {
      combo: '1',
      global: true,
      label: t`Toggle building focus`,
      onKeyDown: () => setHasBuildings(!hasBuildings),
    },
    {
      combo: '2',
      global: true,
      label: t`Toggle public transport focus`,
      onKeyDown: () => setHasPublicTransport(!hasPublicTransport),
    },
    {
      combo: '3',
      global: true,
      label: t`Toggle surfaces`,
      onKeyDown: () => setHasSurfaces(!hasSurfaces),
    },
  ], [hasBuildings, hasPublicTransport, hasSurfaces])
  useHotkeys(hotkeys)

  const [layers, highlightLayers] = React.useMemo(
    () => {
      if (mapStyle.data?.layers) {
        return filterLayers({
          layers: mapStyle.data?.layers, hasBuildings, hasPublicTransport, hasSurfaces,
        })
      }
      return [[], []]
    },
    [mapStyle, hasBuildings, hasPublicTransport, hasSurfaces],
  )

  const {
    NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN: mapboxAccessToken,
    NEXT_PUBLIC_OSM_API_TILE_BACKEND_URL: tileBackendUrl,
  } = useEnvContext()

  return (
    <>
      <MapboxExtraStyles />
      <MapProvider>
        <Map
          initialViewState={initialViewport}
          mapboxAccessToken={mapboxAccessToken}
          onMoveEnd={onViewStateChange}
          onClick={onMouseClick}
          onZoomEnd={onViewStateChange}
          interactive
          interactiveLayerIds={layers?.map((l) => l.id)}
          onLoad={onLoadCallback}
          mapStyle="mapbox://styles/mapbox/light-v11"
          ref={setMapRef}
        >
          {databaseTableNames.map((name) => (
            <Source
              type="vector"
              tiles={[0, 1, 2, 3].map(
                (n) => `${tileBackendUrl?.replace(
                  /{n}/,
                  n.toString(),
                )}/${name}.mvt?limit=10000&bbox={bbox-epsg-3857}&epsg=3857`,
              )}
              id={name}
              key={name}
            />
          ))}

          {layers?.map((layer) => <MapLayer key={layer.id} {...(layer as any)} />)}
          {highlightLayers?.map((layer) => <MapLayer key={layer.id} {...(layer as any)} asFilterLayer />)}

          <NavigationControl style={{ right: '1rem', top: '1rem' }} />
          <GeolocateButton />
        </Map>
      </MapProvider>
      <FixedHelpButton />
      <StyledLoadingIndicator />
    </>
  )
}
