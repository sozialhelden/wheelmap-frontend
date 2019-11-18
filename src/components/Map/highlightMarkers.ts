import L from 'leaflet';
import HighlightableMarker from './HighlightableMarker';
import difference from 'lodash/difference';
import union from 'lodash/union';

let currentHighlightedMarkers: HighlightableMarker[] = [];

export default function highlightMarkers(
  highlightLayer: L.Layer,
  markers: HighlightableMarker[],
  removeOldMarkers: boolean = true,
  isAnimated: boolean = true
) {
  const highlightableMarkers = markers;
  const removedMarkers = difference(currentHighlightedMarkers, highlightableMarkers);

  // always rehighlight, markers tend to lose additional classes when getting temp removed by leaflet
  markers.forEach(marker => marker.highlight(highlightLayer, isAnimated));
  if (removeOldMarkers) {
    removedMarkers.forEach(marker => marker.unhighlight(highlightLayer));
    currentHighlightedMarkers = difference(highlightableMarkers, removedMarkers);
  } else {
    currentHighlightedMarkers = union(highlightableMarkers, currentHighlightedMarkers);
  }
}
