import { Locale } from '../../lib/i18n';
import env from '../../lib/env';

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
  appToken: string
): string {
  const sourceIdParams =
    resourceType == 'place-infos' ? buildSourceIdParams(includeSourceIds, excludeSourceIds) : '';
  const baseUrl = env.REACT_APP_ACCESSIBILITY_CLOUD_BASE_URL || '';
  const url = `${baseUrl}/${resourceType}.json?${sourceIdParams}&x={x}&y={y}&z={z}&appToken=${appToken}&includePlacesWithoutAccessibility=1`;
  if (categoryId && categoryId !== '') {
    return `${url}&includeCategories=${categoryId}`;
  }
  return url;
}
