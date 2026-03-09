import React from "react";
import { useWhitelabel } from "~/hooks/useWhitelabel";
import { useCurrentMappingEvent } from "~/needs-refactoring/lib/context/useCurrentMappingEvent";
import { useUniqueSurveyId } from "~/needs-refactoring/lib/context/useUniqueSurveyId";
import { type TranslatedAppLink, useAppLink } from "./useAppLink";

function sortByOrder(a: TranslatedAppLink, b: TranslatedAppLink) {
  return (a.order || 0) - (b.order || 0);
}

/**
 * @returns An object with the primary link (add location button) and an array of
 * {@link TranslatedAppLink} for the dropdown menu. The links are sorted by their configured order.
 */

export function useNavigation() {
  const { data: joinedMappingEvent } = useCurrentMappingEvent();
  const app = useWhitelabel();
  const appLinks = app.related?.appLinks;
  const uniqueSurveyId = useUniqueSurveyId();

  const translatedAppLinks = Object.values(appLinks ?? {}).map((link) =>
    useAppLink(link, app, uniqueSurveyId, joinedMappingEvent),
  );

  return React.useMemo(() => {
    const primaryLink = translatedAppLinks.find((l) =>
      l.tags?.includes("primary"),
    );

    const linksInDropdownMenu = translatedAppLinks
      .filter((l) => !l.tags?.includes("primary"))
      .sort(sortByOrder);

    return {
      primaryLink,
      linksInDropdownMenu,
    };
  }, [translatedAppLinks]);
}
