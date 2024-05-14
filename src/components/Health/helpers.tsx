import { uniq } from "lodash";
import { t } from "ttag";
import { StyledColors } from "./styles";

export const fetcher = async (url: RequestInfo | URL) => await fetch(url).then((res) => res.json());
export const defaultLimit = 10000;

export type FilterOptions = {};

export const defaultFilterOptions: FilterOptions = {};

export const transferCityToBbox = (city: string) => {
  const baseurl: string = `https://photon.komoot.io/api/?q=${city}&limit=30&lang=de&layer=city&layer=county&layer=country&layer=state&layer=district&layer=locality`;
  return `${baseurl}`;
};

export const useOsmAPI = (options: any, baseurl: string, aggregate: boolean = false) => {
  const { bbox, name, wheelchair, healthcare, tags } = options;
  const editedLimit = `&limit=${defaultLimit}`;
  if (bbox || wheelchair || healthcare || tags) {
    const editedBbox = bbox ? `bbox=${bbox}` : "";
    const editedName = name ? (name.length > 1 ? `&name=${name}` : "") : "";
    const editedWheelchair = wheelchair ? `&wheelchair=${wheelchair}` : "&wheelchair=all";
    const editedHealthcare = healthcare ? `&healthcare=${healthcare}` : "";
    const editedTags = tags ? `&tags=${tags}` : "";
    return `${baseurl}/amenities.json?${editedBbox}${editedName}${editedWheelchair}${editedHealthcare}${editedTags}${editedLimit}&geometry=centroid${aggregate ? "&mode=aggregate&aggregate=count" : ""}`;
  }
  return null;
};

export const formatOSMAddress = (properties: any, longFormat: boolean = true) => {
  if (longFormat) {
    return (properties?.postcode || "") + " " + uniq([properties?.name, properties?.city, properties?.municipality, properties?.town, properties?.village, properties?.city_district, properties?.suburb, properties?.borough, properties?.county, properties?.country].filter(Boolean)).join(", ") + (properties?.neighbourhood ? ` (${properties?.neighbourhood})` : "");
  }
  return properties?.suburb + ", " + properties?.city;
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
