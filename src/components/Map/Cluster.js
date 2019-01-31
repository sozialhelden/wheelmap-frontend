// @flow

import { type EquipmentInfo } from '../../lib/EquipmentInfo';
import { type Feature } from '../../lib/Feature';

export type Cluster = {
  features: ArrayLike<Feature | EquipmentInfo>,
  color?: string,
  center: {
    lat: number,
    lon: number,
  },
};
