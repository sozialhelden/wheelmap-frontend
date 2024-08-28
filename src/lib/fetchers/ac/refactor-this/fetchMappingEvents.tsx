import { MappingEvent } from '../model/ac/MappingEvent'

export default async function fetchMappingEvents(
  appToken: string,
  baseUrl: string,
): Promise<MappingEvent[] | null> {
  const url = `${baseUrl}/mapping-events.json?appToken=${appToken}&includeRelated=images`
  return fetch(url)
    .then((response) => response.json())
    .then((json) => json.results.map((mappingEvent) => ({
      ...mappingEvent,
      images: Object.keys(json.related.images)
        .map((_id) => json.related.images[_id])
        .filter((image) => image.objectId === mappingEvent._id),
    })))
}
