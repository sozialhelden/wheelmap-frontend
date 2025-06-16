import type { Query, QueryParameterValue } from "~/modules/app-state/app-state";
import { lerp } from "~/utils/numbers";

function parseNumber(value: QueryParameterValue): number | undefined {
  if (typeof value !== "string" || !value) {
    return undefined;
  }
  return Number.parseFloat(value);
}

export type MapPosition = {
  latitude: number | undefined;
  longitude: number | undefined;
  zoom: number | undefined;
};

export function parseMapPositionQueryParameter(
  value: QueryParameterValue,
): MapPosition | undefined {
  const { latitude, longitude, zoom } =
    typeof value !== "object" || !value ? {} : value;

  const parsedPosition = {
    latitude: parseNumber(latitude),
    longitude: parseNumber(longitude),
    zoom: parseNumber(zoom),
  };

  return Object.values(parsedPosition).filter(Boolean).length
    ? parsedPosition
    : undefined;
}

export function parseLegacyMapPositionQueryParameter(
  query: Query,
): MapPosition | undefined {
  const latitude = parseNumber(query.lat);
  const longitude = parseNumber(query.lon);
  const zoom = parseNumber(query.zoom) || parseNumber(query.z);

  return latitude && longitude
    ? {
        latitude,
        longitude,
        zoom,
      }
    : undefined;
}

export function serializeMapPosition(
  position: MapPosition | undefined,
): QueryParameterValue {
  if (!position) {
    return undefined;
  }
  const precision = Math.floor(lerp(1, 10, (position.zoom || 0) / 22));
  return {
    latitude: position.latitude?.toFixed(precision),
    longitude: position.longitude?.toFixed(precision),
    zoom: position.zoom?.toFixed(precision),
  };
}
