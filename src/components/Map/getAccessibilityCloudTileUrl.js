// @flow
import { type Locale } from '../../lib/i18n';
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

export default function accessibilityCloudTileUrl(
  locale: Locale,
  includeSourceIds: Array<string>,
  excludeSourceIds: Array<string>
): string {
  const acLocaleString = locale.underscoredString;
  const sourceIdParams = buildSourceIdParams(includeSourceIds, excludeSourceIds);
  const baseUrl = env.REACT_APP_ACCESSIBILITY_CLOUD_BASE_URL || '';
  const token = env.REACT_APP_ACCESSIBILITY_CLOUD_APP_TOKEN || '';
  return `${baseUrl}/place-infos.json?${sourceIdParams}&x={x}&y={y}&z={z}&appToken=${token}&locale=${acLocaleString}&includePlacesWithoutAccessibility=1`;
}
