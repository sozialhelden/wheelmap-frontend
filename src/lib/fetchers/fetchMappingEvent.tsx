import { MappingEvent } from "../model/MappingEvent";
import { apiBaseUrl } from "./config";

export default function fetchMappingEvent(
  appToken: string,
  _id?: string
): Promise<MappingEvent | null> {
  if (!_id) {
    return Promise.resolve(null);
  }

  const url = `${apiBaseUrl}/mapping-events/${_id}.json?appToken=${appToken}`;

  return fetch(url).then((response) => response.json());
}
