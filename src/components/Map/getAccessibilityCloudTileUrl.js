// @flow
import env from '../../lib/env';

export default function accessibilityCloudTileUrl(
  locale: string,
  includeSourceIds: ?string
): string {
  let sourceIdParams = 'excludeSourceIds=LiBTS67TjmBcXdEmX';
  if (includeSourceIds) {
    sourceIdParams = `includeSourceIds=${includeSourceIds}`;
  }
  return `${
    env.public.accessibilityCloud.baseUrl.cached
  }/place-infos.json?${sourceIdParams}&x={x}&y={y}&z={z}&appToken=${
    env.public.accessibilityCloud.appToken
  }&locale=${locale}&includePlacesWithoutAccessibility=1`;
}
