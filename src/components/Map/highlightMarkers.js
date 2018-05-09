// @flow

import HighlightableMarker from './HighlightableMarker';
// import { getFeatureId } from '../../lib/Feature';
import difference from 'lodash/difference';
import union from 'lodash/union';

let currentHighlightedMarkers: HighlightableMarker[] = [];

export default function highlightMarkers(markers: HighlightableMarker[], removeOldMarkers: boolean = true, isAnimated: boolean = true) {
  
  const highlightableMarkers = markers.filter(m => { return m && m.getElement() != null});
  const removedMarkers = difference(currentHighlightedMarkers, highlightableMarkers);

  // always rehighlight, markers tend to lose additional classes when getting temp removed by leaflet
  markers.forEach(marker => marker.highlight(isAnimated));
  if (removeOldMarkers) {
    removedMarkers.forEach(marker => marker.unhighlight());
    currentHighlightedMarkers = highlightableMarkers;
  } else {
    currentHighlightedMarkers = union(highlightableMarkers, currentHighlightedMarkers);
  }
}
