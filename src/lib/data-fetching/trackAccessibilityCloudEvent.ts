import pick from "lodash/pick";
import { globalFetchManager } from "./FetchManager";
import { getUUID, getJoinedMappingEventId } from "../savedState";
import { mappingEventsCache } from "../cache/MappingEventsCache";
import env from "../env";
import { App } from "../model/App";
import { TrackingEvent } from "../model/TrackingModel";

export type Query = {
  [k: string]: string | Array<string> | null;
};

export async function trackAccessibilityCloudEvent(
  app: App,
  event: TrackingEvent,
  userAgent: IUAParser.IResult
): Promise<boolean> {
  const joinedMappingEventId = getJoinedMappingEventId();
  const mappingEvent =
    joinedMappingEventId &&
    (await mappingEventsCache.getMappingEvent(app, joinedMappingEventId));

  // determine userUUID
  const userUUID = getUUID();

  const body = JSON.stringify({
    ...event,
    appId: app._id,
    mappingEvent:
      mappingEvent &&
      pick(
        mappingEvent,
        "_id",
        "name",
        "organizationId",
        "appId",
        "startTime",
        "endTime"
      ),
    userUUID,
    timestamp: Math.round(Date.now() / 1000),
    userAgent,
  });

  const fetchRequest = {
    body,
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  const fetchUrl = `${env.REACT_APP_ACCESSIBILITY_CLOUD_UNCACHED_BASE_URL}/tracking-events/report?appToken=${app.tokenString}`;

  const uploadPromise: Promise<boolean> = new Promise((resolve, reject) => {
    globalFetchManager
      .fetch(fetchUrl, fetchRequest)
      .then((response: Response) => {
        if (response.ok) {
          resolve(true);
        } else {
          reject("failed");
        }
      })
      .catch(reject)
      .catch(console.error);
  });

  return uploadPromise;
}
