import { uniq } from "lodash";
import colors from "../../lib/colors";
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
  hasToiletInfo?: string;
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
  const { bbox, name, wheelchair, healthcare, ["healthcare:speciality"]: healthcareSpeciality, ["blind:description"]: blindDescription, ["deaf:description"]: deafDescription, hasToiletInfo, tags } = options;
  if (bbox) {
    const tString = {
      ...(name && { "t[name]": name }),
      "t[healthcare]": healthcare || "*",
      ...(healthcareSpeciality && { "t[healthcare:speciality]": healthcareSpeciality }),
      ...(blindDescription && { "t[blind:description]": "*" }),
      ...(deafDescription && { "t[deaf:description]": "*" }),
      ...(hasToiletInfo && { "t[toilets:wheelchair]": "yes" }),
    };

    const apiQueryParams = new URLSearchParams({
      // ...(hasToiletInfo && { hasToiletInfo: "true" }),
      ...(wheelchair && { wheelchair }),
      ...(tString && tString),
      ...(tags && { tags }),
    });

    const apiBbox = bbox ? `bbox=${bbox}` : "";
    const apiCollection = "amenities.json";
    const apiLimit = `&limit=${defaultLimit}`;
    const apiGeometry = "&geometry=centroid";
    const apiBuildingsAndIncludeAdmin = "&intersecting=buildings&includeAdmin=true";

    return `${baseurl}/${apiCollection}?${apiBbox}&${apiQueryParams.toString()}${apiGeometry}${apiLimit}`;
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

export function getGoodKeys(properties: any, firstKey: string, secondKey: string): string[] {
  const stringsKeys: string[] = [];
  for (const key in properties) {
    if (key.startsWith(firstKey) && key.endsWith(secondKey)) {
      const name = properties[key];
      if (name) {
        stringsKeys.push(name);
      }
    }
  }
  return stringsKeys;
}

export function getGoodAddress(properties: any): string | null {
  // Check if properties.name exists and is not null
  if (properties?.hasOwnProperty("name") && properties?.name) {
    return properties?.name;
  }

  // Return all the building names and join them with a comma but avoid duplicated strings
  const uniqueBuildingNames = uniq(getGoodKeys(properties, "admin_level:", "name")).join(", ");
  return uniqueBuildingNames.length > 0 ? uniqueBuildingNames : null;
}

export function getGoodName(properties: any): string | null {
  // Check if properties.name exists and is not null
  if (properties?.hasOwnProperty("name") && properties?.name) {
    return properties?.name;
  }

  // Extract names from intersecting buildings
  const buildingNames: string[] = getGoodKeys(properties, "intersecting:buildings:", "name");
  // Return the first valid building name, or null if none found
  return buildingNames.length > 0 ? buildingNames[buildingNames.length - 1] : null;
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
        color: colors.neutralColor,
      };
  }
}
