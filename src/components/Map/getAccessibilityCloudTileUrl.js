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
  // exclude > include > defaults
  if (excludeSourceIds) {
    sourceIdParams = `excludeSourceIds=${[wheelmapSourceId, ...excludeSourceIds].join(',')}`;
  } else if (includeSourceIds) {
    sourceIdParams = `includeSourceIds=${includeSourceIds.join(
      ','
    )}&excludeSourceIds=${wheelmapSourceId}`;
  } else {
    sourceIdParams = `excludeSourceIds=${wheelmapSourceId}`;
  }

  return `${
    env.public.accessibilityCloud.baseUrl.cached
  }/place-infos.json?${sourceIdParams}&x={x}&y={y}&z={z}&appToken=${
    env.public.accessibilityCloud.appToken
  }&locale=${acLocaleString}&includePlacesWithoutAccessibility=1`;
}
