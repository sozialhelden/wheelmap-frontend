import { MappingEvent } from "../model/MappingEvent";
import { apiBaseUrl } from "./config";

export default async function fetchMappingEvents(
  appToken: string
): Promise<MappingEvent[] | null> {
  const url = `${apiBaseUrl}/mapping-events.json?appToken=${appToken}`;
  return fetch(url)
    .then((response) => response.json())
    .then((json) => json.results);
}
