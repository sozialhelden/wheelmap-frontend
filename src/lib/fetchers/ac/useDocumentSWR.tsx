import { SWRResponse } from "swr";
import AccessibilityCloudError from "./AccessibilityCloudError";
import { CollectionName } from "./ACCollection";
import { fetchDocumentWithTypeTag } from "./fetchDocument";
import useAccessibilityCloudAPI from "./useAccessibilityCloudAPI";
import { useMemo } from "react";
import useSWRWithErrorToast from "../../util/useSWRWithErrorToast";

type Args = {
  collectionName: CollectionName;
  _id: string;
  params?: URLSearchParams;
  cached?: boolean;
  shouldRun?: boolean;
}

/**
 * Fetch a single document from the accessibility.cloud API and cache it with SWR.
 *
 * @example const { data, error } = useDocumentSWR({ collectionName: 'PlaceInfos', _id: 'abc123', params: new URLSearchParams({ includeXYZ: 'true' })
 */

type ExtraAPIResultFields = {
  related: Record<string, Record<string, unknown>>;
}

export default function useDocumentSWR<D>({
  collectionName,
  _id,
  params,
  cached = true,
  shouldRun = true,
}: Args): SWRResponse<D & ExtraAPIResultFields, AccessibilityCloudError> {
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
  const document = useSWRWithErrorToast<D & ExtraAPIResultFields, AccessibilityCloudError>(
    transform,
    shouldRun && baseUrl && _id && [baseUrl, collectionName, _id, paramsString],
    fetchDocumentWithTypeTag,
    swrConfig,
  );
  return document;
}