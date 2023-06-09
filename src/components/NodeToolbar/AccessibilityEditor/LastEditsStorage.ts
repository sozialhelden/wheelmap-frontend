import { Bbox } from "../../Map/geoTileToBbox";

type MapEditLocation = {
  lat: number,
  lon: number,
  timestamp: number,
};

export function saveEditInLocalStorage(edit: MapEditLocation) {
  const edits = getEditsFromLocalStorage();
  edits.push(edit);
  localStorage.setItem('edits', JSON.stringify(edits.slice(-20)));
}

export function getEditsFromLocalStorage(): MapEditLocation[] {
  const edits = localStorage.getItem('edits');
  return edits ? JSON.parse(edits) : [];
}

function bboxContainsPoint(bbox: Bbox, point: MapEditLocation): boolean {
  return point.lat <= bbox[3] && point.lat >= bbox[1] && point.lon <= bbox[2] && point.lon >= bbox[0];
}

export function hasEditsInBBox(bbox: Bbox): boolean {
  const edits = getEditsFromLocalStorage();
  return edits.some(edit => bboxContainsPoint(bbox, edit));
}

export function getLastTimestamp() {
  const edits = getEditsFromLocalStorage();
  return edits.length > 0 ? edits[edits.length - 1].timestamp : 0;
}
