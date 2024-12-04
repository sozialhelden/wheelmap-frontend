/* eslint-disable no-continue */
import { isEqual, omit } from 'lodash'
import mapboxgl from 'mapbox-gl'

export const databaseTableNames = [
  'admin',
  'places',
  'amenities',
  'entrances_or_exits',
  'elevators',
  'ramps',
  'pedestrian_highways',
  'conveying',
  'toilets',
  'buildings',

  'master_routes',
  'master_route_members',
  'routes',
  'route_members',
  'stop_areas',
  'stop_area_members',
  'platforms',
  'stop_positions',
  'stations',
] as const

const publicTransportLayerIds = new Set([
  'osm-master-routes',
  'osm-master-route-members',
  'osm-routes',
  'osm-route-members',
  'osm-stop-areas',
  'osm-stop-area-members',
  'osm-platforms',
  'osm-stop-positions',
  'osm-stations',
])

const buildingLayerIds = new Set([
  'osm-building-wheelchair-fill',
  'osm-building-outline-defined',
  'osm-building-outline-undefined',
  'osm-wheelchair-unknown-label',
  'osm-wheelchair-no-label',
  'osm-wheelchair-limited-label',
  'osm-wheelchair-yes-label',
  'osm-poi-wheelchair-circle',
])

const surfaceLayerIds = new Set([
  'osm-pedestrian-outline',
  'osm-surface-fill',
])

const isOsmLayer = (layer: mapboxgl.Layer) => layer.id.startsWith('osm-')
const isPublicTransportLayer = (layer: mapboxgl.Layer) => publicTransportLayerIds.has(layer.id)
const isBuildingLayer = (layer: mapboxgl.Layer) => buildingLayerIds.has(layer.id)
const isSurfaceLayer = (layer: mapboxgl.Layer) => surfaceLayerIds.has(layer.id)

/**
 * Filter layers from a mapbox-gl stylesheet.
 *
 * Keep only layers that have an `id` matching a 'osm-' prefix, and change sources to match the
 * table names from our OSM database.
 *
 * @param layers The layers to filter
 * @returns an array containing `[layers, highlightLayers]`, where `highlightLayers` is specifically
 * for filters that include a specific place.
 */
export function filterLayers(
  {
    layers,
    hasBuildings,
    hasPublicTransport,
    hasSurfaces,
    primaryLanguage,
    secondaryLanguage,
  }: {
    layers: mapboxgl.Layer[];
    hasBuildings: boolean;
    hasPublicTransport: boolean;
    hasSurfaces: boolean;
    primaryLanguage: string;
    secondaryLanguage: string | undefined;
  },
): [mapboxgl.Layer[], mapboxgl.Layer[]] {
  const regularLayers: mapboxgl.Layer[] = []
  const highlightLayers: mapboxgl.Layer[] = []
  for (let i = 0; i < layers.length; i += 1) {
    const layer = layers[i]
    if (!isOsmLayer(layer)) {
      continue
    }
    if (isPublicTransportLayer(layer) && !hasPublicTransport) {
      continue
    }
    if (isBuildingLayer(layer) && !hasBuildings) {
      continue
    }
    if (isSurfaceLayer(layer) && !hasSurfaces) {
      continue
    }
    const source = databaseTableNames.find((tableName) => layer['source-layer']?.startsWith(tableName))
    if (!source) {
      continue
    }

    // Replace the name property with a localized, formatted version (with a potential line break)
    const localizedLayer = JSON.parse(
      JSON
        .stringify(layer)
        .replace(
          '["get","name"]',
          `
            [
              "let",

              "user_language_name", [ "coalesce", ["get", "name:${primaryLanguage}"], ["get", "name:${secondaryLanguage}"]],
              "local_name", ["coalesce", ["get", "loc_name"], ["get", "name"]],
              "default_fallback_language_name", ["get", "name:en"],

              [
                "let",
                "prio0", ["coalesce", ["var", "user_language_name"], ["var", "local_name"], ["var", "default_fallback_language_name"]],
                "prio1", ["coalesce", ["var", "local_name"], ["var", "default_fallback_language_name"]],
                "prio2", ["coalesce", ["var", "default_fallback_language_name"]],
                [
                  "format",
                  ["coalesce", ["var", "prio0"], ["var", "prio1"], ["var", "prio2"], ""],
                  {},
                  "\\n",
                  {},
                  ["case",
                    ["!=",
                      ["coalesce", ["var", "prio0"], ["var", "prio1"], ["var", "prio2"]],
                      ["coalesce", ["var", "prio1"], ["var", "prio2"]]
                    ],
                    ["coalesce", ["var", "prio1"], ["var", "prio2"], ""],
                    ["!=",
                      ["coalesce", ["var", "prio1"], ["var", "prio2"]],
                      ["var", "prio1"]
                    ],
                    ["var", "prio1"],
                    ["!=",
                      ["coalesce", ["var", "prio1"], ["var", "prio2"]],
                      ["var", "prio2"]
                    ],
                    ["var", "prio2"],
                    ""
                  ],
                  {"font-scale": 0.9, "text-color": "rgba(0,0,0,0.7)"}
                ]
              ]
            ]
          `
        ),
    )

    const enhancedLayer = {
      ...localizedLayer,
      source,
      'source-layer': 'default',
      layout: omit(localizedLayer.layout, 'line-z-offset'),
      paint: omit(localizedLayer.paint, 'line-occlusion-opacity'),
    }
    console.log(enhancedLayer)
    const accessibilityCloudLayer = { ...enhancedLayer, id: enhancedLayer.id + '-ac', source: 'ac:PlaceInfo', 'source-layer': 'place-infos' };

    if (layer.id.startsWith('osm-selected')) {
      highlightLayers.push(enhancedLayer)
      highlightLayers.push(accessibilityCloudLayer)
    } else {
      regularLayers.push(enhancedLayer)
      if (layer.id.match(/osm-wheelchair-\w+-label/)) {
        regularLayers.push(accessibilityCloudLayer)
      }
    }
  }

  return [regularLayers, highlightLayers]
}
