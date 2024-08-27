import { Feature } from 'geojson';
import flatten from 'lodash/flatten';
import sortBy from 'lodash/sortBy';
import { isOrHasAccessibleToilet } from '../../model/accessibility/isOrHasAccessibleToilet';
import { normalizedCoordinatesForFeature } from '../../model/geo/normalizedCoordinatesForFeature';
import { calculateBoundingBox } from './calculateBoundingBox';
import { getDistanceFromCoordsToFeature } from './getDistanceFromCoordsToFeature';

function fetchWheelmapToiletPlaces(
  lat: number,
  lon: number,
  radius: number,
): Promise<Feature[]> {
  const bbox = calculateBoundingBox(lat, lon, radius);
  const url = `${config.wheelmapApiBaseUrl}/api/v1/amenities.geojson?geometryTypes=centroid&bbox=${bbox.west},${bbox.south},${bbox.east},${bbox.north}&tag['wheelchair:toilet']=yes&limit=50`;

  return globalFetchManager.fetch(url).then((response) => response.json());
}

function fetchAcToiletPlaces(
  lat: number,
  lon: number,
  radius: number,
  includeSourceIds: Array<string>,
  excludeSourceIds: Array<string>,
  appToken?: string,
): Promise<Feature[]> {
  const sourceIdParams = buildSourceIdParams(
    includeSourceIds,
    excludeSourceIds,
  );
  const baseUrl = process.env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_BASE_URL || '';
  const url = `${baseUrl}/place-infos.json?${sourceIdParams}&latitude=${lat}&longitude=${lon}&accuracy=${radius}&limit=20&appToken=${appToken}`;
  return globalFetchManager
    .fetch(url)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      return null;
    })
    .then((responseJson) => {
      const parsed = responseJson
        && accessibilityCloudFeatureCollectionFromResponse(responseJson);
      return parsed ? parsed.features : [];
    });
}

const nearbyRadiusMeters = 300;

export function fetchToiletsNearby(
  lat: number,
  lon: number,
  disableWheelmapSource: boolean,
  includeSourceIds: Array<string>,
  excludeSourceIds: Array<string>,
  appToken: string,
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
    appToken,
  );

  return Promise.all([wm, ac]).then((results) => {
    const distanceMapping = getDistanceFromCoordsToFeature.bind(this, [
      lon,
      lat,
    ]);
    return sortBy(
      flatten(results).filter(isOrHasAccessibleToilet),
      distanceMapping,
    );
  });
}

export function fetchToiletsNearFeature(
  feature: Feature,
  disableWheelmapSource: boolean,
  includeSourceIds: Array<string>,
  excludeSourceIds: Array<string>,
  appToken: string,
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
    appToken,
  );
}

if (typeof window !== 'undefined') {
  // @ts-ignore
  window.fetchToiletsNearby = fetchToiletsNearby;
}
