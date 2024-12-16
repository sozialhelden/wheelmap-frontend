import React from "react";
import { useCurrentApp } from "../../../lib/context/AppContext";
import { useUniqueSurveyId } from "../../../lib/context/useUniqueSurveyId";
import { useCurrentMappingEvent } from "../../../lib/context/useCurrentMappingEvent";
import { translatedStringFromObject } from "../../../lib/i18n/translatedStringFromObject";
import { insertPlaceholdersToAddPlaceUrl } from "../../../lib/model/ac/insertPlaceholdersToAddPlaceUrl";
import type { IApp } from "../../../lib/model/ac/App";
import type IAppLink from '~/lib/model/ac/IAppLink';
import type { MappingEvent } from "../../../lib/model/ac/MappingEvent";


export function useAppLinks() {
  const { data: joinedMappingEvent } = useCurrentMappingEvent();
  const app = useCurrentApp();
  const uniqueSurveyId = useUniqueSurveyId();
  const {
    related: { appLinks } = {},
  } = app;

  const links = React.useMemo(
    () => Object.values(appLinks ?? {})
      .map((link) => expandLinkMetadata(link, app, uniqueSurveyId, joinedMappingEvent)
      ),
    [app, appLinks, joinedMappingEvent, uniqueSurveyId]
  );
  return links;
}

export function expandLinkMetadata(
  link: IAppLink,
  app: IApp,
  uniqueSurveyId: string,
  joinedMappingEvent?: MappingEvent,
) {
  const baseUrl = `https://${app._id}/`;
  const localizedUrl = translatedStringFromObject(link.url);
  const url =
    link.url &&
    insertPlaceholdersToAddPlaceUrl(
      baseUrl,
      localizedUrl,
      joinedMappingEvent,
      uniqueSurveyId,
    );
  const label = translatedStringFromObject(link.label);
  const badgeLabel = translatedStringFromObject(link.badgeLabel);
  const isExternal = localizedUrl?.startsWith("http");
  return {
    ...link,
    url,
    label,
    badgeLabel,
    isExternal,
  };
}
