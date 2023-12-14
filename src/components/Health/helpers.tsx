
export const fetcher = (url: RequestInfo | URL) => fetch(url).then((res) => res.json());

export type OSM_DATA = {
  features: [
    {
      geometry: {
        coordinates: [
          number,
          number
        ],
        type: string, // Point
      },
      type: string, //Feature,
      properties: {
        osm_type: string, //R,
        osm_id: number,
        extent: [
          number,
          number,
          number,
          number
        ],
        country: string, // Deutschland,
        osm_key: string, // place,
        countrycode: string, // DE,
        osm_value: string, // city,
        name: string, // Hannover,
        county: string, // Region Hannover,
        state: string, // Niedersachsen,
        type: string, // city
      }
    }
  ]
}

// "name": "Turn-Klubb zu Hannover",
// "wheelchair": "yes",
// "wheelchair_description": null,
// "wheelchair_toilet": null,
// "lat": 52.366247567151355,
// "lon": 9.74301691912578,
// "id": 11184300493,
// "osm_type": "node",
// "osm_id": "node/11184300493",
// "street": null,
// "housenumber": null,
// "city": null,
// "postcode": null,
// "website": "https://www.turn-klubb.de",
// "phone": null,
// "node_type": {
//   "identifier": "sports_center"
// },
// "category": {
//   "identifier": "sport"
// }

export type OSM_API_FEATURE = {  
  name: string,
  wheelchair: string,
  wheelchair_description: string,
  wheelchair_toilet: string,
  lat: number,
  lon: number,
  id: number,
  osm_type: string,
  osm_id: string, // type/id
  street: string,
  housenumber: string,
  city: string,
  postcode: string,
  website: string,
  phone: string,
  node_type: {
    identifier: string,
  },
  category: {
    identifier: string,
  }
}