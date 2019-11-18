import { EquipmentInfo } from '../../lib/EquipmentInfo';
import { Feature, YesNoLimitedUnknown } from '../../lib/Feature';

export type Cluster = {
  features: Array<Feature | EquipmentInfo>,
  backgroundColor?: string,
  foregroundColor?: string,
  accessibility?: YesNoLimitedUnknown,
  // do not expose leaflet types
  leafletMarker: any,
  center: {
    lat: number,
    lng: number,
  },
};
