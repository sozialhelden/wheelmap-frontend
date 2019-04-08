// @flow

import { type EquipmentInfo } from '../../lib/EquipmentInfo';
import { type Feature, type YesNoUnknown } from '../../lib/Feature';

export type Cluster = {
  features: ArrayLike<Feature | EquipmentInfo>,
  backgroundColor?: string,
  foregroundColor?: string,
  accessibility?: YesNoUnknown,
  // do not expose leaflet types
  leafletMarker: any,
  center: {
    lat: number,
    lng: number,
  },
};
