import { WheelmapFeature } from "../Feature";


export function isParkingFacility(feature: WheelmapFeature) {
  return feature.properties.node_type?.identifier === "parking" ||
    feature.properties.tags?.parking;
}
