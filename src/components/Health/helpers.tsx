import { useContext } from "react";
import { t } from "ttag";
import EnvContext from "../shared/EnvContext";
import { StyledColors } from "./styles";

export const fetcher = (url: RequestInfo | URL) => fetch(url).then((res) => res.json());
export const defaultLimit = 10000;

export type FilterOptions = {
  bbox: [number, number, number, number];
  city: string | undefined;
  wheelchair: string;
  healthcare: string;
  sort: string;
  name: string;
};

export const defaultFilterOptions: FilterOptions = {
  bbox: [0, 0, 0, 0],
  city: undefined,
  wheelchair: "",
  healthcare: "",
  sort: "d:asc",
  name: "",
};

export const transferCityToBbox = (options: any) => {
  const { city } = options;
  const baseurl: string = `https://photon.komoot.io/api/?q=${city}&limit=30&lang=de`;
  if (city) {
    return `${baseurl}`;
  }
};

export const useOsmAPIUrl = (options: any) => {
  const { bbox, wheelchair, healthcare } = options;
  const env = useContext(EnvContext);
  const baseurl: string = env.NEXT_PUBLIC_OSM_API_BACKEND_URL;
  const editedLimit = `limit=${defaultLimit}`;
  if (bbox || wheelchair || healthcare) {
    const editedBbox = `bbox=${bbox}`;
    const editedWheelchair = `wheelchair=${wheelchair}`;
    const editedHealthcare = `healthcare=${healthcare}`;
    return `${baseurl}/amenities.json?${editedBbox}&${editedWheelchair}&${editedHealthcare}&${editedLimit}&geometry=centroid`;
  }
  return [];
};

export const useFilterOptionsUrl = (options: any) => {
  const { bbox, wheelchair, tags } = options;
  const env = useContext(EnvContext);
  const baseurl: string = env.NEXT_PUBLIC_OSM_API_BACKEND_URL;
  const editedLimit = `limit=${defaultLimit}`;
  if (bbox || wheelchair || tags) {
    const editedBbox = bbox && `bbox=${bbox}`;
    const editedTags = `tags=${tags}`;
    const editedWheelchair = `wheelchair=${wheelchair}`;
    return `${baseurl}/amenities.json?${editedBbox}&${editedWheelchair}&${editedLimit}` + `&${editedTags}&geometry=centroid&mode=aggregate&aggregate=count`;
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

  return R * c;
}

export function getWheelchairSettings(wheelchair: string): any {
  switch (wheelchair) {
    case "all":
      return {
        label: t`All Wheelchair Settings`,
        color: StyledColors.grey,
      };
    case "yes":
      return {
        label: t`Wheelchair Accessible`,
        color: StyledColors.green,
      };
    case "limited":
      return {
        label: t`Limited Wheelchair Accessibility`,
        color: StyledColors.orange,
      };

    case "no":
      return {
        label: t`Not Wheelchair Accessible`,
        color: StyledColors.red,
      };
    default:
      return {
        label: t`Wheelchair Accessibility Unknown`,
        color: StyledColors.grey,
      };
  }
}
