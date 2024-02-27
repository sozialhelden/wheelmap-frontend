import { useContext } from "react";
import { t } from "ttag";
import EnvContext from "../shared/EnvContext";
import { StyledColors } from "./styles";

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

export type FilterOptions = {
  city: string;
  wheelchair: string;
  limit: string;
  healthcare: string;
  ["healthcare:speciality"]: string;
};

export const defaultFilterOptions: FilterOptions = {
  city: "Berlin",
  wheelchair: "yes",
  limit: "1000",
  healthcare: "pharmacy",
  ["healthcare:speciality"]: "",
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

export const useHealthAPIURL = (options: any) => {
  const { city, wheelchair, healthcare, ["healthcare:speciality"]: healthcareSpeciality, limit } = options;
  const env = useContext(EnvContext);
  const baseurl: string = env.NEXT_PUBLIC_OSM_API_LEGACY_BASE_URL;
  if (city || wheelchair || healthcare || limit) {
    return `${baseurl}/healthcare.json?${city}&${wheelchair}&${healthcareSpeciality}&${healthcare}&${limit}&geometry=centroid`;
  }
};

export function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const A1 = toRadians(lat1);
  const A2 = toRadians(lat2);
  const B1 = toRadians(lat2 - lat1);
  const B2 = toRadians(lon2 - lon1);

  const a = Math.sin(B1 / 2) * Math.sin(B1 / 2) + Math.cos(A1) * Math.cos(A2) * Math.sin(B2 / 2) * Math.sin(B2 / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return (R * c) / 1000;
}

export function getWheelchairColor(wheelchair: string): any {
  let wheelchairStatus = {
    label: "",
    color: "",
  };
  switch (wheelchair) {
    case "yes":
      wheelchairStatus = {
        label: t`Vollrollstuhlgerecht`,
        color: StyledColors.green,
      };
    case "limited":
      wheelchairStatus = {
        label: t`Eingeschränkt rollstuhlgerecht`,
        color: StyledColors.orange,
      };

    case "no":
      wheelchairStatus = {
        label: t`Nicht rollstuhlgerecht`,
        color: StyledColors.red,
      };
    default:
      wheelchairStatus = {
        label: t`Unbekannt`,
        color: StyledColors.grey,
      };
  }
  console.log(wheelchairStatus);
  return wheelchairStatus;
}
