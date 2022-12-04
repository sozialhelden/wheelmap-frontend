import { t } from "ttag";
import { isOrHasAccessibleToilet } from "../../shared/isOrHasAccessibleToilet";
import { PlaceProperties } from "@sozialhelden/a11yjson";
import { RootCategoryEntry } from "./RootCategoryEntry";

// This must be a function - Results from t`` are dependent on the current context.
// If t`` is called at root level of a module, it doesn't know the translations yet
// as they are loaded later, at runtime.
// Using it inside a function while rendering ensures the runtime-loaded translations
// are correctly returned.
export function getRootCategoryTable(): { [key: string]: RootCategoryEntry } {
  return {
    shopping: {
      // translator: Root category
      name: t`Shopping`,
    },
    food: {
      // translator: Root category
      name: t`Food & Drinks`,
    },
    public_transfer: {
      // translator: Root category
      name: t`Transport`,
    },
    leisure: {
      // translator: Root category
      name: t`Leisure`,
    },
    accommodation: {
      // translator: Root category
      name: t`Hotels`,
    },
    tourism: {
      // translator: Root category
      name: t`Tourism`,
    },
    education: {
      // translator: Root category
      name: t`Education`,
    },
    government: {
      // translator: Root category
      name: t`Authorities`,
    },
    health: {
      // translator: Root category
      name: t`Health`,
    },
    money_post: {
      // translator: Root category
      name: t`Money`,
    },
    sport: {
      // translator: Root category
      name: t`Sports`,
    },
    // This returns all places that either ARE a toilet, or HAVE an accessible toilet
    toilets: {
      // translator: Meta category for any toilet or any place with an accessible toilet
      name: t`Toilets`,
      isMetaCategory: true,
      isSubCategory: true,
      filter: (properties: PlaceProperties | undefined) => {
        if (!properties) {
          return true;
        }
        return (
          properties.category === "toilets" ||
          isOrHasAccessibleToilet(properties) === "yes"
        );
      },
    },
  };
}
