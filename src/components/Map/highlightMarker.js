// @flow

import HighlightableMarker from './HighlightableMarker';
import { getFeatureId } from '../../lib/Feature';


let currentHighlightedMarker: ?HighlightableMarker = null;
let lastId = null;


export function removeCurrentHighlightedMarker() {
  if (!currentHighlightedMarker) return;
  currentHighlightedMarker.unhighlight();
  currentHighlightedMarker = null;
}


export default function highlightMarker(marker: HighlightableMarker) {
  if (marker !== currentHighlightedMarker) removeCurrentHighlightedMarker();
  currentHighlightedMarker = marker;
  const featureId = getFeatureId(marker.options.feature);
  const isAnimated = featureId !== lastId;
  lastId = featureId;
  if (!marker.highlight(isAnimated)) {
    currentHighlightedMarker = null;
  }
}
