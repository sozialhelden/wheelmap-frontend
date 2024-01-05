export const fetcher = (url: RequestInfo | URL) => fetch(url).then((res) => res.json());

export type OSM_DATA = {
  features: [
    {
      geometry: {
        coordinates: [number, number];
        type: string; // Point
      };
      type: string; //Feature,
      properties: {
        osm_type: string; //R,
        osm_id: number;
        extent: [number, number, number, number];
        country: string; // Deutschland,
        osm_key: string; // place,
        countrycode: string; // DE,
        osm_value: string; // city,
        name: string; // Hannover,
        county: string; // Region Hannover,
        state: string; // Niedersachsen,
        type: string; // city
      };
    }
  ];
};

export type OSM_API_FEATURE = {
  name: string;
  wheelchair: string;
  wheelchair_description: string;
  wheelchair_toilet: string;
  lat: number;
  lon: number;
  id: number;
  osm_type: string;
  osm_id: string; // type/id
  street: string;
  housenumber: string;
  city: string;
  postcode: string;
  website: string;
  phone: string;
  node_type: {
    identifier: string;
  };
  category: {
    identifier: string;
  };
};

export const healthAPI = (options: any) => {
  const { city, wheelchairAccessibility, limit } = options;
  const baseurl: string = process.env.NEXT_PUBLIC_OSM_API_LEGACY_BASE_URL;
  return city ? `${baseurl}/api/healthcare?${city}&geometry=centroid&wheelchairAccessibility=${wheelchairAccessibility}&limit=${limit}` : null;
};
