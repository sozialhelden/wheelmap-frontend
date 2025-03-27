import type { TypeTaggedPlaceInfo } from "../../model/geo/AnyFeature";
import useDocumentSWR from "./useDocumentSWR";

export const usePlaceInfo = (_id?: string) =>
  useDocumentSWR<TypeTaggedPlaceInfo>({ collectionName: "PlaceInfos", _id });
