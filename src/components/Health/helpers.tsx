import { faWheelchair } from "@fortawesome/free-solid-svg-icons";
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
  bbox: [number, number, number, number];
  wheelchair: string;
  healthcare: string;
  ["healthcare:speciality"]: string;
  limit: string;
};

export const defaultFilterOptions: FilterOptions = {
  bbox: [13.088345, 52.6755087, 13.7611609, 52.3382448],
  wheelchair: "yes",
  healthcare: "",
  ["healthcare:speciality"]: "",
  limit: "1000",
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
  osm_id: string;
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
  const { bbox, wheelchair, healthcare, ["healthcare:speciality"]: healthcareSpeciality, limit } = options;
  const env = useContext(EnvContext);
  const baseurl: string = env.NEXT_PUBLIC_OSM_API_LEGACY_BASE_URL;
  if (bbox || wheelchair || healthcare || limit) {
    const editedBbox = `bbox=${bbox}`;
    return `${baseurl}/healthcare.json?${editedBbox}&${wheelchair}&${healthcare}&${limit}&geometry=centroid`;
  }
};

export const transferCityToBbox = (options: any) => {
  const { city } = options;
  const baseurl: string = `https://photon.komoot.io/api/?q=${city}&limit=30&lang=de`;
  if (city) {
    return `${baseurl}`;
  }
};

export const getFilterOptions = (options: any) => {
  const { bbox, wheelchair, tags, limit } = options;
  const baseurl: string = `http://localhost:4000/api/v1/amenities.json?bbox=${bbox}&geometry=centroid&wheelchair=${wheelchair}&limit=${limit}&mode=aggregate&tags=${tags}&aggregate=count`;
  if (bbox || wheelchair || tags || limit) {
    return `${baseurl}`;
  }
  return [];
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
  switch (wheelchair) {
    case "yes":
      return {
        label: t`Vollrollstuhlgerecht`,
        color: StyledColors.green,
        icon: faWheelchair,
      };
    case "limited":
      return {
        label: t`Eingeschränkt rollstuhlgerecht`,
        color: StyledColors.orange,
        icon: faWheelchair,
      };

    case "no":
      return {
        label: t`Nicht rollstuhlgerecht`,
        color: StyledColors.red,
        icon: faWheelchair,
      };
    default:
      return {
        label: t`Unbekannt`,
        color: StyledColors.grey,
        icon: faWheelchair,
      };
  }
}
