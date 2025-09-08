import { useTranslations } from "~/modules/i18n/hooks/useTranslations";
import type { MappingEvent } from "~/needs-refactoring/lib/model/ac/MappingEvent";
import { insertPlaceholdersToAddPlaceUrl } from "~/needs-refactoring/lib/model/ac/insertPlaceholdersToAddPlaceUrl";
import type { WhitelabelApp, WhitelabelNavLink } from "~/types/whitelabel";

export function useAppLink(
  link: WhitelabelNavLink,
  app: WhitelabelApp,
  uniqueSurveyId: string,
  joinedMappingEvent?: MappingEvent,
) {
  const baseUrl = `https://${app._id}/`;
  const localizedUrl = useTranslations(link.url);
  const label = useTranslations(link.label);
  const badgeLabel = useTranslations(link.badgeLabel);
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
