import useSWR, { SWRResponse } from "swr";
import AccessibilityCloudError from "./AccessibilityCloudError";
import { CollectionName } from "./ACCollection";
import { fetchCollectionWithTypeTags } from "./fetchCollection";
import useAccessibilityCloudAPI from "./useAccessibilityCloudAPI";
import { Geometry, Point } from "geojson";
import { ListOrFeatureCollection } from "./ListOrFeatureCollection";
import { CollectionResultType } from "./CollectionResultType";
import useSWRWithErrorToast from "../../util/useSWRWithErrorToast";
import { useMemo } from "react";

type Args = {
  collectionName: CollectionName;
  params?: URLSearchParams;
  cached?: boolean;
  shouldRun?: boolean;
}


/**
 * Fetch a collection of documents from the accessibility.cloud API and cache it with SWR.
 *
 * The collection can be a list of documents (wrapped with metadata) or a geometry-typed GeoJSON FeatureCollection.
 *
 * @example const { data, error } = useCollectionSWR({ collectionName: 'PlaceInfos', params: new URLSearchParams({ x: 1, y: 2, z: 3 }, cached: false, shouldRun: true })
 */

export default function useCollectionSWR<D, R extends CollectionResultType = 'List', G extends Geometry | null = Point>({
  collectionName,
  params,
  cached = true,
  shouldRun = true,
}: Args): SWRResponse<ListOrFeatureCollection<D, R, G>, AccessibilityCloudError> {
  const { baseUrl, appToken } = useAccessibilityCloudAPI({ cached });
  const paramsWithAppToken = new URLSearchParams(params);
  paramsWithAppToken.append('appToken', appToken);
  const paramsString = paramsWithAppToken.toString();
  const transform = useMemo(() => ({
    summary: (text: any) => <span>{text}</span>,
    instructions: (text: any) => <span>{text}</span>,
    details: (text: any) => <span>{text}</span>,
  }), []);
  const swrConfig = useMemo(() => ({}), []);
  return useSWRWithErrorToast<ListOrFeatureCollection<D, R, G>, AccessibilityCloudError>(
    transform,
    shouldRun && baseUrl && [baseUrl, collectionName, paramsString],
    fetchCollectionWithTypeTags,
    swrConfig,
  );
}