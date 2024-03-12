import { faWheelchair } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { t } from "ttag";
import EnvContext from "../shared/EnvContext";
import { StyledColors } from "./styles";

export const fetcher = (url: RequestInfo | URL) => fetch(url).then((res) => res.json());
export const defaultLimit = 10000;

export type FilterOptions = {
  bbox: [number, number, number, number];
  city: string;
  wheelchair: string;
  healthcare: string;
  ["healthcare:speciality"]: string;
  sort: string;
};

export const defaultFilterOptions: FilterOptions = {
  bbox: [13.088345, 52.6755087, 13.7611609, 52.3382448],
  city: "Berlin",
  wheelchair: "yes",
  healthcare: "",
  ["healthcare:speciality"]: "",
  sort: "distance:asc",
};

export const transferCityToBbox = (options: any) => {
  const { city } = options;
  const baseurl: string = `https://photon.komoot.io/api/?q=${city}&limit=30&lang=de`;
  if (city) {
    return `${baseurl}`;
  }
};

export const useHealthAPIURL = (options: any) => {
  const { bbox, wheelchair, healthcare, ["healthcare:speciality"]: healthcareSpeciality } = options;
  const env = useContext(EnvContext);
  const baseurl: string = env.NEXT_PUBLIC_OSM_API_LEGACY_BASE_URL;
  if (bbox || wheelchair || healthcare) {
    const editedBbox = `bbox=${bbox}`;
    const editedLimit = `limit=${defaultLimit}`;
    const editedWheelchair = `wheelchair=${wheelchair}`;
    const editedHealthcare = `healthcare=${healthcare}`;
    const editedHealthcareSpeciality = `healthcare:speciality=${healthcareSpeciality}`;
    return `${baseurl}/healthcare.json?${editedBbox}&${editedWheelchair}&${editedHealthcare}&${editedHealthcareSpeciality}&${editedLimit}&geometry=centroid`;
  }
  return [];
};

export const getFilterOptions = (options: any) => {
  const { bbox, wheelchair, tags } = options;
  if (bbox || wheelchair || tags) {
    const editedBbox = `bbox=${bbox}`;
    const editedLimit = `limit=${defaultLimit}`;
    const editedTags = `tags=${tags}`;
    const editedWheelchair = `wheelchair=${wheelchair}`;
    return `http://localhost:4000/api/v1/amenities.json?${editedBbox}&${editedWheelchair}&${editedLimit}` + `&${editedTags}&geometry=centroid&mode=aggregate&aggregate=count`;
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

export function getWheelchairSettings(wheelchair: string): any {
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
