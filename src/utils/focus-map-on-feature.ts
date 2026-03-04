import type { MapRef } from "react-map-gl/mapbox";
import type { Geometry } from "geojson";

export type FocusMapOptions = {
  padding?: number;
  zoom?: number;
  maxZoom?: number;
  durationMs?: number;
};

export const DEFAULT_OPTIONS: Required<
  Pick<FocusMapOptions, "padding" | "zoom" | "maxZoom" | "durationMs">
> = {
  padding: 0,
  zoom: 15,
  maxZoom: 19,
  durationMs: 1000,
};

export type Extent = [
  minLon: number,
  minLat: number,
  maxLon: number,
  maxLat: number,
];

export type LatLon = { lat?: number; lon?: number };

type FeatureLike = {
  bbox?: unknown;
  geometry?: Geometry;
};

type FocusTarget =
  | { extent: Extent }
  | { latLon: LatLon }
  | { feature: FeatureLike };

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
  );
}

function isExtent(value: unknown): value is Extent {
  return (
    Array.isArray(value) &&
    value.length === 4 &&
    value.every((n) => Number.isFinite(n))
  );
}

function isLonLatTuple(value: unknown): value is [number, number] {
  return (
    Array.isArray(value) &&
    value.length >= 2 &&
    Number.isFinite(value[0]) &&
    Number.isFinite(value[1])
  );
}

function resolveMap(
  mapLike: mapboxgl.Map | MapRef | null | undefined,
): mapboxgl.Map | undefined {
  if (!mapLike) return undefined;

  if (typeof (mapLike as MapRef).getMap === "function") {
    return (mapLike as MapRef).getMap();
  }

  return mapLike as mapboxgl.Map;
}

function focusFromExtent(
  map: mapboxgl.Map,
  extent: Extent,
  options: FocusMapOptions,
) {
  const duration =
    options.durationMs ??
    (prefersReducedMotion() ? 0 : DEFAULT_OPTIONS.durationMs);
  const padding = options.padding ?? DEFAULT_OPTIONS.padding;
  const maxZoom = options.maxZoom ?? DEFAULT_OPTIONS.maxZoom;

  map.fitBounds(
    [
      [extent[0], extent[1]],
      [extent[2], extent[3]],
    ],
    { duration, padding, maxZoom },
  );
}

function focusFromLatLon(
  map: mapboxgl.Map,
  lat: number,
  lon: number,
  options: FocusMapOptions,
) {
  const duration =
    options.durationMs ??
    (prefersReducedMotion() ? 0 : DEFAULT_OPTIONS.durationMs);

  map.flyTo({
    center: [lon, lat],
    zoom: options.zoom ?? DEFAULT_OPTIONS.zoom,
    duration,
    essential: true,
  });
}

/**
 * Focus a map on either:
 * - extent: [minLon, minLat, maxLon, maxLat]
 * - lat/lon (can be undefined; the function will no-op)
 * - feature-like object containing bbox or geometry.coordinates
 */
export function focusMapOnFeature(
  mapLike: mapboxgl.Map | MapRef | null | undefined,
  target: FocusTarget,
  options: FocusMapOptions = {},
): boolean {
  const map = resolveMap(mapLike);
  if (!map) return false;

  if ("extent" in target) {
    focusFromExtent(map, target.extent, options);
    return true;
  }

  if ("latLon" in target) {
    const lat = target.latLon.lat;
    const lon = target.latLon.lon;

    if (Number.isFinite(lat) && Number.isFinite(lon)) {
      focusFromLatLon(map, lat, lon, options);
      return true;
    }
    return false;
  }

  const bbox = target.feature.bbox;
  if (isExtent(bbox)) {
    focusFromExtent(map, bbox, options);
    return true;
  }

  const coords = target.feature.geometry?.coordinates;
  if (isLonLatTuple(coords)) {
    focusFromLatLon(map, coords[1], coords[0], options);
    return true;
  }

  return false;
}
