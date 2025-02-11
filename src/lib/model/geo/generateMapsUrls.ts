import { centerOfMass } from "@turf/turf";
import type { AnyFeature } from "./AnyFeature";

export function generateMapsUrl(
  userAgent: UAParser.IResult | undefined | null,
  feature: AnyFeature,
  placeName: string,
) {
  const osName = userAgent?.os.name;

  if (!feature.geometry || !osName) return null;

  const center = centerOfMass(feature.geometry);
  const [lon, lat] = center.geometry?.coordinates ?? [];

  if (!lat || !lon) return null;

  if (osName.match(/^Windows/)) {
    // see https://docs.microsoft.com/en-us/previous-versions/windows/apps/jj635237(v=win.10)
    return `bingmaps:?collection=point.${lat}_${lon}_${encodeURIComponent(placeName)}`;
  }

  if (osName === "Mac OS" || osName === "iOS") {
    // see https://developer.apple.com/library/content/featuredarticles/iPhoneURLScheme_Reference/MapLinks/MapLinks.html
    return `http://maps.apple.com/?ll=${lat},${lon}&q=${encodeURIComponent(placeName)}`;
  }

  // see https://developer.android.com/guide/components/intents-common#Maps
  return `geo:${lat},${lon}?q=${lat},${lon}(${encodeURIComponent(placeName)})`;
}
