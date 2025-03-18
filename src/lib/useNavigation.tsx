import React from "react";
import { useAppContext } from "~/lib/context/AppContext";
import { useCurrentMappingEvent } from "~/lib/context/useCurrentMappingEvent";
import { useUniqueSurveyId } from "~/lib/context/useUniqueSurveyId";
import { useWindowSize } from "~/lib/util/useViewportSize";
import { type TranslatedAppLink, useAppLink } from "./useAppLink";

function sortByOrder(a: TranslatedAppLink, b: TranslatedAppLink) {
  return (a.order || 0) - (b.order || 0);
}

/**
 * @returns An object with two arrays of {@link TranslatedAppLink}: one for the toolbar, one for
 * the menu. The links are sorted by their configured order, and divided depending on importance
 * and current viewport size.
 */

export function useNavigation() {
  const windowSize = useWindowSize();
  const isBigViewport = windowSize.width >= 1024;

  const { data: joinedMappingEvent } = useCurrentMappingEvent();
  const app = useAppContext();
  const appLinks = app.related?.appLinks;
  const uniqueSurveyId = useUniqueSurveyId();

  const translatedAppLinks = Object.values(appLinks ?? {}).map((link) =>
    useAppLink(link, app, uniqueSurveyId, joinedMappingEvent),
  );

  return React.useMemo(() => {
    // We show some links outside of the menu, and some inside of it.
    // First, we sort the links into categories:
    const alwaysVisible = translatedAppLinks.filter(
      (l) => l.importance === "alwaysVisible",
    );
    const advertisedIfPossible = translatedAppLinks.filter(
      (l) => !l.importance || l.importance === "advertisedIfPossible",
    );
    const insignificant = translatedAppLinks.filter(
      (l) => l.importance === "insignificant",
    );

    // Then, we sort the links by their configured order, and return them.
    const linksInToolbar = [
      ...(isBigViewport ? advertisedIfPossible : []),
      ...alwaysVisible,
    ].sort(sortByOrder);
    const linksInDropdownMenu = [
      ...(isBigViewport ? [] : advertisedIfPossible),
      ...insignificant,
    ].sort(sortByOrder);

    return {
      linksInToolbar,
      linksInDropdownMenu,
    };
  }, [translatedAppLinks, isBigViewport]);
}
