// @flow
import { t } from 'c-3po';

import type { Feature } from "../../../lib/Feature";

// see https://developer.android.com/guide/components/intents-common#Maps
export function generateGeoUrl(feature: Feature, placeName: string) {
  const coords = feature.geometry.coordinates;
  return `geo:${coords[1]},${coords[0]}?q=${coords[1]},${coords[0]}(${encodeURIComponent(placeName)})`;
}

// see https://developer.apple.com/library/content/featuredarticles/iPhoneURLScheme_Reference/MapLinks/MapLinks.html
export function generateAppleMapsUrl(feature: Feature, placeName: string) {
  const coords = feature.geometry.coordinates;
  return `http://maps.apple.com/?ll=${coords[1]},${coords[0]}&q=${encodeURIComponent(placeName)}`;
}

// see https://docs.microsoft.com/en-us/previous-versions/windows/apps/jj635237(v=win.10)
export function generateBingMapsUrl(feature: Feature, placeName: string) {
  const coords = feature.geometry.coordinates;
  return `bingmaps:?collection=point.${coords[1]}_${coords[0]}_${encodeURIComponent(placeName)}`;
}

export function generateMapsUrl(feature: Feature, placeName: string) {
  const isBingMaps = navigator.appVersion.indexOf("Win") != -1;
  const isAppleMaps = navigator.appVersion.indexOf("Mac") != -1 || 
    ['iPhone', 'iPad', 'iPod'].indexOf(navigator.platform) != -1;

  if (isBingMaps) {
    // translator: Button caption shown in the place toolbar
    const caption = t`Open in Bing Maps`;
    return {url: generateBingMapsUrl(feature, placeName), caption};
  }

  if (isAppleMaps) {
    // translator: Button caption shown in the place toolbar
    const caption = t`Open in Apple Maps`;
    return {url: generateAppleMapsUrl(feature, placeName), caption};
  }

  // translator: Button caption shown in the place toolbar
  const caption = t`Open in Maps App`;
  return {url: generateGeoUrl(feature, placeName), caption};
}