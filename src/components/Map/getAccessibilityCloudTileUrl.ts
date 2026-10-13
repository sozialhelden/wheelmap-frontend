import env from '../../lib/env';
import { osmSameAsUriPrefixes } from '../../lib/model/osmUri';

export function buildSourceIdParams(
  includeSourceIds: Array<string>,
  excludeSourceIds: Array<string>
): string {
  // always do not show wheelmap source, but all other sources
  const wheelmapSourceId = 'LiBTS67TjmBcXdEmX';

  let sourceIdParams = '';
  // include > exclude > defaults
  if (includeSourceIds && includeSourceIds.length > 0) {
    sourceIdParams = `includeSourceIds=${includeSourceIds.join(',')}`;
  } else if (excludeSourceIds && excludeSourceIds.length > 0) {
    sourceIdParams = `excludeSourceIds=${[wheelmapSourceId, ...excludeSourceIds].join(',')}`;
  } else {
    sourceIdParams = `excludeSourceIds=${wheelmapSourceId}`;
  }

  return sourceIdParams;
}

export default function getAccessibilityCloudTileUrl(
  resourceType: 'place-infos' | 'equipment-infos',
  includeSourceIds: Array<string>,
  excludeSourceIds: Array<string>,
  categoryId: string,
  appToken: string,
  // Place infos that reference an OSM place are shown merged into the OSM place's marker, so
  // they don't need to be loaded when OSM places are shown.
  excludeOsmLinkedPlaces = false
): string {
  const sourceIdParams =
    resourceType === 'place-infos'
      ? [
          buildSourceIdParams(includeSourceIds, excludeSourceIds),
          excludeOsmLinkedPlaces && `excludeURIPrefix=${osmSameAsUriPrefixes.join(',')}`,
        ].filter(Boolean).join('&')
      : '';
  const baseUrl = env.REACT_APP_ACCESSIBILITY_CLOUD_BASE_URL || '';
  const url = `${baseUrl}/${resourceType}.json?${sourceIdParams}&x={x}&y={y}&z={z}&appToken=${appToken}&includePlacesWithoutAccessibility=1`;
  if (categoryId && categoryId !== '') {
    return `${url}&includeCategories=${categoryId}`;
  }
  return url;
}
