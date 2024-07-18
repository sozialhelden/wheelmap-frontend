import { uniq } from "lodash";
import { StyledColors } from "./styles";

export const defaultLimit = 10000;

export type FilterOptions = {};

export const defaultFilterOptions: FilterOptions = {};

export const transferCityToBbox = (city: string) => {
  const baseurl: string = `https://photon.komoot.io/api/?q=${city}&limit=30&lang=de&layer=city&layer=county&layer=country&layer=state&layer=district&layer=locality`;
  return `${baseurl}`;
};

export type QueryParameters = {
  bbox?: string[];
  name?: string;
  wheelchair?: string;
  healthcare?: string;
  ["healthcare:speciality"]?: string;
  ["blind:description"]?: string;
  ["deaf:description"]?: string;
  tags?: string;
};

export type AmenityStatsResponse = {
  healthcare?: string;
  "healthcare:speciality"?: string;
  wheelchair?: string;
  count: number;
}[];

export type AmenityListFeaturesgeometryResponse = {
  type: string;
  coordinates: [number, number];
};

export type AmenityListFeaturesPropertiesResponse = {
  name: string;
  level: string;
  phone: string;
  amenity: string;
  "addr:city": string;
  dispensing: string;
  healthcare: string;
  wheelchair: string;
  "addr:street": string;
  "addr:suburb": string;
  "addr:postcode": string;
  opening_hours: string;
  "addr:housenumber": string;
  "check_date:opening_hours": string;
};

export type AmenityListFeaturesResponse = {
  type: string;
  _id: string;
  geometry: AmenityListFeaturesgeometryResponse;
  centroid: AmenityListFeaturesgeometryResponse;
  properties: AmenityListFeaturesPropertiesResponse;
};

export type AmenityListResponse = {
  type: string;
  features: AmenityListFeaturesResponse[];
};

export function generateAmenityListURL(options: QueryParameters, baseurl: string): string {
  const { bbox, name, wheelchair, healthcare, ["healthcare:speciality"]: healthcareSpeciality, ["blind:description"]: blindDescription, ["deaf:description"]: deafDescription, tags } = options;
  const editedLimit = `&limit=${defaultLimit}`;
  if (bbox || wheelchair || healthcare || healthcareSpeciality || tags) {
    const editedBbox = bbox ? `bbox=${bbox}` : "";
    const editedName = name ? (name.length > 1 ? `&name=${name}` : "") : "";
    const editedWheelchair = wheelchair ? `&wheelchair=${wheelchair}` : "";
    const editedHealthcare = healthcare ? `&healthcare=${healthcare}` : "&healthcare=*";
    const editedHealthcareSpeciality = healthcareSpeciality ? `&healthcare:speciality=${healthcareSpeciality}` : "";
    const editedBlindDescription = blindDescription ? `&blind:description=*` : "";
    const editedDeafDescription = deafDescription ? `&deaf:description=*` : "";
    const editedTags = tags ? `&tags=${tags}` : "";
    return `${baseurl}/amenities.json?${editedBbox}${editedName}${editedWheelchair}${editedHealthcare}${editedHealthcareSpeciality}${editedTags}${editedBlindDescription}${editedDeafDescription}${editedLimit}&geometry=centroid`;
  }
  return undefined;
}

export function generateAmenityStatsURL(options: QueryParameters, baseurl: string): string {
  const url = generateAmenityListURL(options, baseurl);
  if (!url) {
    return undefined;
  }
  return `${url}&mode=aggregate&aggregate=count`;
}

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
    case "yes":
      return {
        label: "Fully wheelchair accessible",
        color: StyledColors.green,
      };
    case "limited":
      return {
        label: "Partially wheelchair accessible",
        color: StyledColors.orange,
      };

    case "no":
      return {
        label: "Not wheelchair accessible",
        color: StyledColors.red,
      };
    default:
      return {
        label: "Wheelchair accessibility Unknown",
        color: StyledColors.grey,
      };
  }
}
