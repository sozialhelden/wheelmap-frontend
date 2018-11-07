// @flow
import env from '../../lib/env';

import { type Locale } from '../../lib/i18n';

export default function accessibilityCloudTileUrl(
  locale: Locale,
  includeSourceIds: ?string
): string {
  const acLocaleString = locale.underscoredString;

  let sourceIdParams = 'excludeSourceIds=LiBTS67TjmBcXdEmX'; // Do not show Wheelmap's AC source
  if (includeSourceIds) {
    sourceIdParams = `includeSourceIds=${includeSourceIds}`;
  }
  return `${
    env.public.accessibilityCloud.baseUrl.cached
  }/place-infos.json?${sourceIdParams}&x={x}&y={y}&z={z}&appToken=${
    env.public.accessibilityCloud.appToken
  }&locale=${acLocaleString}&includePlacesWithoutAccessibility=1`;
}
