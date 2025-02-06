import { useMemo } from "react";
import type { IImage } from "../../../model/ac/Image";
import useDocumentSWR from "../useDocumentSWR";

export function useMappingEvent(_id: string) {
  const response = useDocumentSWR({
    type: "ac:MappingEvent",
    _id,
    params: new URLSearchParams({ includeRelated: "images" }),
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
          .map((_id) => response.data?.related.images[_id])
          .filter(
            (image: IImage) => image.objectId === response.data?._id,
          ) as IImage[],
      },
    };
  }, [response]);

  return responseWithImages;
}
