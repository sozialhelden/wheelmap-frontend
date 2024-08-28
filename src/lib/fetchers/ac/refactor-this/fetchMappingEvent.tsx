import { MappingEvent } from '../../../model/ac/MappingEvent';
import useDocumentSWR from '../useDocumentSWR'
import { useMemo } from 'react'

export function useMappingEvent(_id: string) {
  const response = useDocumentSWR<MappingEvent>({
    collectionName: 'MappingEvents',
    _id,
    params: new URLSearchParams({ includeRelated: 'images' }),
  });

  const responseWithImages = useMemo(() => {
    if (!response.data) {
      return response;
    }
    return {
      ...response,
      data: {
        ...response.data,
        images: Object.keys(response.data.related.images)
          .map((_id) => response.data.related.images[_id])
          .filter((image) => image['objectId'] === response.data._id),
      },
    };
  }, [response]);

  return responseWithImages;
}
