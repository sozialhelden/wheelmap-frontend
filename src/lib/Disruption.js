// @flow
import type { Point } from 'geojson-flow';
import type { FeatureCollection } from './Feature';
import type { CategoryString } from './EquipmentInfo';

export type Disruption = {
  type: 'Feature',
  geometry: Point,
  properties: {
    _id?: string,
    originalId?: string,
    originalEquipmentInfoId?: string,
    equipmentInfoId?: string,
    originalPlaceInfoId?: string,
    placeInfoId?: string,
    originalData?: string,
    sourceId?: string,
    sourceImportId?: string,
    category?: CategoryString,
    isEquipmentWorking?: boolean,
    outOfServiceReason?: string,
    furtherDescription?: string,
    plannedCompletion?: string,
    outOfServiceOn?: string,
    outOfServiceTo?: string,
    lastUpdate?: string,
  },
};

export type DisruptionFeatureCollection = FeatureCollection<Disruption>;
