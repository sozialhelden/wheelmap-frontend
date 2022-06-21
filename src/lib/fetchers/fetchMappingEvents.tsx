import { MappingEvent } from "../model/MappingEvent";
import { apiBaseUrl } from "./config";

export default async function fetchMappingEvents(
  appToken: string
): Promise<MappingEvent[] | null> {
  const url = `${apiBaseUrl}/mapping-events.json?appToken=${appToken}&includeRelated=images`;
  return fetch(url)
    .then((response) => response.json())
    .then((json) =>
      json.results.map((mappingEvent) => ({
        ...mappingEvent,
        images: Object.keys(json.related.images)
          .map((_id) => json.related.images[_id])
          .filter((image) => image.objectId === mappingEvent._id),
      }))
    );
}
