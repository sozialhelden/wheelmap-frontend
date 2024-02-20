import { t } from "ttag";

export const fetcher = (url: RequestInfo | URL) =>
  fetch(url).then((res) => res.json());

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
  distance: number;
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

export const limitValue = 1000;
export const healthAPI = (options: any) => {
  const { city, wheelchair, healthcare, limit } = options;
  const baseurl: string = process.env.NEXT_PUBLIC_OSM_API_LEGACY_BASE_URL;
  if (city) {
    return `${baseurl}/healthcare?${city}&${wheelchair}&${healthcare}&${limit}&geometry=centroid`;
  }
};

export function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3;
  const A1 = toRadians(lat1);
  const A2 = toRadians(lat2);
  const B1 = toRadians(lat2 - lat1);
  const B2 = toRadians(lon2 - lon1);

  const a =
    Math.sin(B1 / 2) * Math.sin(B1 / 2) +
    Math.cos(A1) * Math.cos(A2) * Math.sin(B2 / 2) * Math.sin(B2 / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return (R * c) / 1000;
}

export function isWheelchairAccessible(wheelchair: string): string {
  switch (wheelchair) {
    case "yes":
      return t`Rollstuhlzugänglich`;
    case "no":
      return t`Nicht rollstuhlzugänglich`;
    case "limited":
      return t`Eingeschränkt rollstuhlzugänglich`;
    default:
      return t`Keine Angaben`;
  }
}
