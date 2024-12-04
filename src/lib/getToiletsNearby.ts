import flatten from 'lodash/flatten';
import sortBy from 'lodash/sortBy';
import env from './env';
import config from './config';
import { Feature } from './Feature';

import { globalFetchManager } from './FetchManager';
import {
  convertResponseToWheelmapFeature,
  accessibilityCloudFeatureCollectionFromResponse,
  hasAccessibleToilet,
  normalizedCoordinatesForFeature,
} from './Feature';
import { buildSourceIdParams } from '../components/Map/getAccessibilityCloudTileUrl';
import { geoDistance } from './geoDistance';

function calculateBoundingBox(lat: number, lon: number, radius: number) {
  const latRadian = (lat * Math.PI) / 180;
  const degLatKm = 110.574235;
  const degLongKm = 110.572833 * Math.cos(latRadian);
  const deltaLat = radius / 1000.0 / degLatKm;
  const deltaLong = radius / 1000.0 / degLongKm;

  const topLat = lat + deltaLat;
  const bottomLat = lat - deltaLat;
  const leftLng = lon - deltaLong;
  const rightLng = lon + deltaLong;

  return {
    west: leftLng,
    east: rightLng,
    north: topLat,
    south: bottomLat,
  };
}

function fetchWheelmapToiletPlaces(lat: number, lon: number, radius: number): Promise<Feature[]> {
  const bbox = calculateBoundingBox(lat, lon, radius);
  const url = `${config.wheelmapApiBaseUrl}/api/nodes?bbox=${bbox.west},${bbox.south},${bbox.east},${bbox.north}&limit=20&hasAccessibleToilet=yes&api_key=${config.wheelmapApiKey}`;

  return globalFetchManager
    .fetch(url)
    .then(response => response.json())
    .then(responseJson => responseJson?.nodes?.map(convertResponseToWheelmapFeature));
}

function fetchAcToiletPlaces(
  lat: number,
  lon: number,
  radius: number,
  includeSourceIds: Array<string>,
  excludeSourceIds: Array<string>,
  appToken?: string
): Promise<Feature[]> {
  const sourceIdParams = buildSourceIdParams(includeSourceIds, excludeSourceIds);
  const baseUrl = env.REACT_APP_ACCESSIBILITY_CLOUD_BASE_URL || '';
  const url = `${baseUrl}/place-infos.json?${sourceIdParams}&latitude=${lat}&longitude=${lon}&accuracy=${radius}&limit=20&appToken=${appToken}`;
  return globalFetchManager
    .fetch(url)
    .then(response => {
      if (response.status === 200) {
        return response.json();
      }
      return null;
    })
    .then(responseJson => {
      const parsed = responseJson && accessibilityCloudFeatureCollectionFromResponse(responseJson);
      return parsed ? parsed.features : [];
    });
}

function filterAccessibleToilets(feature: Feature): boolean {
  if (!feature || !feature.properties) {
    return false;
  }

  const hasToilet = hasAccessibleToilet(feature.properties) === 'yes';
  return hasToilet;
}

function getDistanceTo(coords: [number, number], feature: Feature) {
  const featureCoords = normalizedCoordinatesForFeature(feature);
  if (!featureCoords) {
    return Number.POSITIVE_INFINITY;
  }

  return geoDistance(coords, featureCoords);
}

const nearbyRadiusMeters = 300;

export function fetchToiletsNearby(
  lat: number,
  lon: number,
  disableWheelmapSource: boolean,
  includeSourceIds: Array<string>,
  excludeSourceIds: Array<string>,
  appToken: string
) {
  const wm = disableWheelmapSource
    ? Promise.resolve([])
    : fetchWheelmapToiletPlaces(lat, lon, nearbyRadiusMeters);
  const ac = fetchAcToiletPlaces(
    lat,
    lon,
    nearbyRadiusMeters,
    includeSourceIds,
    excludeSourceIds,
    appToken
  );

  return Promise.all([wm, ac]).then(results => {
    const distanceMapping = getDistanceTo.bind(this, [lon, lat]);
    return sortBy(flatten(results).filter(filterAccessibleToilets), distanceMapping);
  });
}

export function fetchToiletsNearFeature(
  feature: Feature,
  disableWheelmapSource: boolean,
  includeSourceIds: Array<string>,
  excludeSourceIds: Array<string>,
  appToken: string
) {
  if (!feature) {
    return [];
  }

  if (feature.properties && hasAccessibleToilet(feature.properties) === 'yes') {
    return [];
  }

  const coords = normalizedCoordinatesForFeature(feature);
  if (!coords) {
    return [];
  }

  const [lon, lat] = coords;

  return fetchToiletsNearby(
    lat,
    lon,
    disableWheelmapSource,
    includeSourceIds,
    excludeSourceIds,
    appToken
  );
}

if (typeof window !== 'undefined') {
  // @ts-ignore
  window.fetchToiletsNearby = fetchToiletsNearby;
}

