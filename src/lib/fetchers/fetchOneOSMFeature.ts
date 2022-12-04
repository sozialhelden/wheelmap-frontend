import OSMFeature from "../model/osm/OSMFeature";
import { osmAPIBaseUrl } from "./config";

export async function fetchOneOSMFeature(
  prefixedId?: string
): Promise<OSMFeature | undefined> {
  const [prefix, id] = prefixedId?.split(":") ?? [];
  const url = `${osmAPIBaseUrl}/${prefix}/${id}.geojson`;
  const r = await fetch(url);
  return await r.json();
}
