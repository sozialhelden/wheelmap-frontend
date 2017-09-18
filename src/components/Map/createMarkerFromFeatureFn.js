// @flow


import type { RouterHistory } from 'react-router-dom';
import type { Feature } from '../../lib/Feature';
import HighlightableMarker from './HighlightableMarker';


export default function createMarkerFromFeatureFn(history: RouterHistory) {
  return (feature: Feature, latlng: [number, number]) => {
    const properties = feature && feature.properties;
    if (!properties) return null;
    return new HighlightableMarker(latlng, { history, feature });
  };
}
