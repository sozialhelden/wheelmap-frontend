import { EquipmentInfo, PlaceInfo } from "@sozialhelden/a11yjson";
import { YesNoLimitedUnknown } from "../../lib/model/Feature";

export type Cluster = {
  features: Array<PlaceInfo | EquipmentInfo>;
  backgroundColor?: string;
  foregroundColor?: string;
  accessibility?: YesNoLimitedUnknown;
  // do not expose leaflet types
  leafletMarker: any;
  center: {
    lat: number;
    lng: number;
  };
};
