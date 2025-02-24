import React from "react";
import type { SWRResponse } from "swr";
import { createChange } from "~/lib/fetchers/osm-api/createChange";
import { createChangeset } from "~/lib/fetchers/osm-api/createChangeset";
import { callBackendToUpdateInhouseDb } from "../callBackendToUpdateInhouseDb";
import useInhouseOSMAPI from "./useInhouseOSMAPI";

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
  const { baseUrl: inhouseBaseUrl } = useInhouseOSMAPI({ cached: false });

  return React.useCallback(async () => {
    if (
      !currentOSMObjectOnServer ||
      !accessToken ||
      !newTagValue ||
      !osmType ||
      !osmId
    ) {
      // changes will not be visible
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
      /* changes will not be visible */
      postErrorMessage();
      throw new Error(error);
    }

    /* changes will be visible after import from osm (once per hour) */
    postSuccessMessage();

    try {
      /* this gets stuck when the imposm process is running at the same time */
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
