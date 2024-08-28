import { TypeTaggedPlaceInfo } from '../../../model/geo/AnyFeature'
import useDocumentSWR from '../useDocumentSWR'

export const usePlaceInfo = (_id?: string) => {
  return useDocumentSWR<TypeTaggedPlaceInfo>({ collectionName: 'PlaceInfos', _id });
}
