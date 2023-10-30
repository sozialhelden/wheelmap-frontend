export const fetcher = (url: RequestInfo | URL) => fetch(url).then((res) => res.json());


/** 
 * a type for JSON data 
 * the object looks like this:
features: [
    {
      geometry: {
        coordinates: [
          9.7385532,
          52.3744779
        ],
        type: Point
      },
      type: Feature,
      properties: {
        osm_type: R,
        osm_id: 59418,
        extent: [
          9.60443,
          52.4543349,
          9.9184259,
          52.3051373
        ],
        country: Deutschland,
        osm_key: place,
        countrycode: DE,
        osm_value: city,
        name: Hannover,
        county: Region Hannover,
        state: Niedersachsen,
        type: city
      }
    }
  ]
  */ 
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
