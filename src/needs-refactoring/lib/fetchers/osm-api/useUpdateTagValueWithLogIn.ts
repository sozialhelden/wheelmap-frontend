import React from "react";
import type { SWRResponse } from "swr";
import useOsmApi from "~/hooks/useOsmApi";
import { createChange } from "~/needs-refactoring/lib/fetchers/osm-api/createChange";
import { createChangeset } from "~/needs-refactoring/lib/fetchers/osm-api/createChangeset";
import { callBackendToUpdateInhouseDb } from "../callBackendToUpdateInhouseDb";

export type OSMAPIElement = {
  version: string;
  lat: string;
  lon: string;
  id: string;
  tags: Record<string, string>;
};
export type OSMAPIElementResponse = SWRResponse<OSMAPIElement>;

export default function useUpdateTagValueWithLogInCallback({
  accessToken,
  baseUrl,
  osmType,
  osmId,
  tagName,
  newTagValue,
  currentOSMObjectOnServer,
  postSuccessMessage,
  postErrorMessage,
}: {
  accessToken: string;
  baseUrl: string;
  osmType: string | undefined;
  osmId: number | undefined;
  tagName: string;
  newTagValue: string;
  currentOSMObjectOnServer: OSMAPIElement | undefined;
  postSuccessMessage: () => void;
  postErrorMessage: () => void;
}) {
  const { baseUrl: inhouseBaseUrl } = useOsmApi({ cached: false });

  return React.useCallback(async () => {
    if (
      !currentOSMObjectOnServer ||
      !accessToken ||
      !newTagValue ||
      !osmType ||
      !osmId
    ) {
      postErrorMessage();
      throw new Error("Missing or undefined parameters.");
    }

    try {
      const changesetId = await createChangeset({
        baseUrl,
        accessToken,
        tagName,
        newValue: newTagValue,
      });

      await createChange({
        baseUrl,
        accessToken,
        osmType,
        osmId,
        changesetId,
        tagName,
        newTagValue,
        currentOSMObjectOnServer,
      });
    } catch (error) {
      postErrorMessage();
      throw new Error(error);
    }

    postSuccessMessage();

    try {
      await callBackendToUpdateInhouseDb({
        baseUrl: inhouseBaseUrl,
        osmType,
        osmId,
        tagName,
      });
    } catch (error) {
      throw new Error(error);
    }
  }, [
    inhouseBaseUrl,
    baseUrl,
    currentOSMObjectOnServer,
    accessToken,
    newTagValue,
    tagName,
    osmId,
    osmType,
    postSuccessMessage,
    postErrorMessage,
  ]);
}
