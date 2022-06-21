import pick from "lodash/pick";
import { App } from "./model/App";
import { TrackingEvent } from "./model/TrackingModel";
import { MappingEvent } from "./model/MappingEvent";

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
  app: App;
  event: TrackingEvent;
  userAgent?: IUAParser.IResult;
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

  const fetchUrl = `${process.env.REACT_APP_ACCESSIBILITY_CLOUD_UNCACHED_BASE_URL}/tracking-events/report?appToken=${app.tokenString}`;

  return fetch(fetchUrl, fetchRequest).then((r) => r.json());
}
