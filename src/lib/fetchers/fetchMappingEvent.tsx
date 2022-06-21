import useSWR from "swr";
import { MappingEvent } from "../model/MappingEvent";
import { apiBaseUrl } from "./config";

export default function fetchMappingEvent(
  appToken: string,
  _id?: string
): Promise<MappingEvent | null> {
  if (!_id) {
    return Promise.resolve(null);
  }
  const url = `${apiBaseUrl}/mapping-events/${_id}.json?appToken=${appToken}&includeRelated=images`;
  return fetch(url)
    .then((response) => response.json())
    .then((mappingEvent) => ({
      ...mappingEvent,
      images: Object.keys(mappingEvent.related.images)
        .map((_id) => mappingEvent.related.images[_id])
        .filter((image) => image.objectId === mappingEvent._id),
    }));
}

export function useMappingEvent({
  appToken,
  _id,
}: {
  appToken: string;
  _id: string;
}) {
  return useSWR([appToken, _id], fetchMappingEvent);
}
