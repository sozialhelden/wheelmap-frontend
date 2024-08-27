import { AnyFeature } from '../../../model/geo/AnyFeature';

export const anyFeature: AnyFeature = {
  '@type': 'a11yjson:PlaceInfo',
  _id: '123',
  properties: {
    name: { de: 'Rossmann' },
    category: 'shop',
  },
  geometry: {
    type: 'Point',
    coordinates: [13.38886, 52.51704],
  },
};
