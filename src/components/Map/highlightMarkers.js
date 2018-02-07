// @flow

import HighlightableMarker from './HighlightableMarker';
// import { getFeatureId } from '../../lib/Feature';
import difference from 'lodash/difference';
import union from 'lodash/union';

let currentHighlightedMarkers: HighlightableMarker[] = [];

export default function highlightMarkers(markers: HighlightableMarker[], removeOldMarkers: boolean = true) {
  const newMarkers = difference(markers, currentHighlightedMarkers);
  const removedMarkers = difference(currentHighlightedMarkers, markers);
  const isAnimated = true;
  newMarkers.forEach(marker => marker.highlight(isAnimated));
  if (removeOldMarkers) {
    removedMarkers.forEach(marker => marker.unhighlight());
    currentHighlightedMarkers = markers;
  } else {
    currentHighlightedMarkers = union(markers, currentHighlightedMarkers);
  }
}
