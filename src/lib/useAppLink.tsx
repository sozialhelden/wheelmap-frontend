import { translatedStringFromObject } from "~/lib/i18n/translatedStringFromObject";
import type { IApp } from "~/lib/model/ac/App";
import type IAppLink from "~/lib/model/ac/IAppLink";
import type { MappingEvent } from "~/lib/model/ac/MappingEvent";
import { insertPlaceholdersToAddPlaceUrl } from "~/lib/model/ac/insertPlaceholdersToAddPlaceUrl";

export function useAppLink(
  link: IAppLink,
  app: IApp,
  uniqueSurveyId: string,
  joinedMappingEvent?: MappingEvent,
) {
  const baseUrl = `https://${app._id}/`;
  const localizedUrl = translatedStringFromObject(link.url);
  const label = translatedStringFromObject(link.label);
  const badgeLabel = translatedStringFromObject(link.badgeLabel);
  const isExternal = localizedUrl?.startsWith("http");

  /** Insert values of template variables into the link's URL */
  const url =
    link.url &&
    insertPlaceholdersToAddPlaceUrl(
      baseUrl,
      localizedUrl,
      joinedMappingEvent,
      uniqueSurveyId,
    );

  return {
    ...link,
    url,
    label,
    badgeLabel,
    isExternal,
  };
}

export type TranslatedAppLink = ReturnType<typeof useAppLink>;
