// @flow

import type { Feature } from 'geojson-flow';
import FeatureCache from './FeatureCache';

export default class WheelmapFeatureCache extends FeatureCache {
  static fetchFeature(id): Promise<Feature> {
    return fetch(`/nodes/${id}.json`);
  }

  static getFeatureFromResponse(response): Promise<Feature> {
    // Example response:
    // {
    //   "node": {
    //     "id": 3864666405,
    //     "name": "Cantinerie",
    //     "lat": 52.5411956,
    //     "lon": 13.3863657,
    //     "street": "Gustav-Meyer-Allee",
    //     "housenumber": "25",
    //     "postcode": "13355",
    //     "city": "Berlin",
    //     "wheelchair": "yes",
    //     "wheelchair_description": null,
    //     "wheelchair_toilet": "yes",
    //     "region": "Berlin",
    //     "type_id": 22,
    //     "category_id": 2,
    //     "website": "www.cantinerie.de",
    //     "phone": null,
    //     "photo_ids": []
    //   },
    //   "node_types": [
    //     {
    //       "id": 22,
    //       "identifier": "restaurant",
    //       "category": 2,
    //       "icon": "restaurant"
    //     }
    //   ]
    // }

    return response.json().then((responseJson) => {
      const node = responseJson.node;
      const nodeTypes = responseJson.node_types;
      if (!node) throw new Error('Cannot parse server response.');
      const typeInfo = { type: nodeTypes.find(type => type.id === node.type_id) };
      const properties = Object.assign({}, responseJson.node, typeInfo);
      const feature: Feature = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [node.lon, node.lat],
        },
        properties,
      };
      return feature;
    });
  }
}

export const wheelmapFeatureCache = new WheelmapFeatureCache();
