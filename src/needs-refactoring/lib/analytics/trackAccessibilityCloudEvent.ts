import pick from "lodash/pick";
import type UAParser from "ua-parser-js";
import type { IApp } from "../model/ac/App";
import type { MappingEvent } from "../model/ac/MappingEvent";
import type { TrackingEvent } from "../model/ac/TrackingModel";

export type Query = {
  [k: string]: string | Array<string> | null;
};

export async function trackAccessibilityCloudEvent({
  app,
  event,
  userAgent,
  mappingEvent,
  userUUID,
}: {
  app: IApp;
  event: TrackingEvent;
  userAgent?: UAParser.IResult;
  mappingEvent?: MappingEvent;
  userUUID: string;
}): Promise<unknown> {
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
        "endTime",
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

  const fetchUrl = `${process.env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_UNCACHED_BASE_URL}/tracking-events/report?appToken=${app.tokenString}`;

  return fetch(fetchUrl, fetchRequest).then((r) => r.json());
}
