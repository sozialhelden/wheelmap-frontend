// @flow
import env from '../../lib/env';

import { type Locale } from '../../lib/i18n';

export default function accessibilityCloudTileUrl(
  locale: Locale,
  includeSourceIds: Array<string>,
  excludeSourceIds: Array<string>
): string {
  const acLocaleString = locale.underscoredString;

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

  return `${
    env.public.accessibilityCloud.baseUrl.cached
  }/place-infos.json?${sourceIdParams}&x={x}&y={y}&z={z}&appToken=${
    env.public.accessibilityCloud.appToken
  }&locale=${acLocaleString}&includePlacesWithoutAccessibility=1`;
}
