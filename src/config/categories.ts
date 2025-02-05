import type { FC } from "react";
import { t } from "ttag";
import { ToiletIcon } from "~/components/icons/categories/toilet";
import {
  accommodation,
  education,
  food,
  government,
  health,
  leisure,
  money_post,
  public_transfer,
  shopping,
  sport,
  tourism,
} from "~/components/icons/mainCategories";

export const categories = {
  shopping: {
    // translator: Root category
    name: () => t`Shopping`,
    priority: 10,
    icon: shopping,
  },
  food: {
    // translator: Root category
    name: () => t`Food & Drinks`,
    priority: 20,
    icon: food,
  },
  public_transfer: {
    // translator: Root category
    name: () => t`Transport`,
    priority: 30,
    icon: public_transfer,
  },
  leisure: {
    // translator: Root category
    name: () => t`Leisure`,
    priority: 40,
    icon: leisure,
  },
  accommodation: {
    // translator: Root category
    name: () => t`Hotels`,
    priority: 40,
    icon: accommodation,
  },
  tourism: {
    // translator: Root category
    name: () => t`Tourism`,
    icon: tourism,
  },
  education: {
    // translator: Root category
    name: () => t`Education`,
    icon: education,
  },
  government: {
    // translator: Root category
    name: () => t`Authorities`,
    icon: government,
  },
  health: {
    // translator: Root category
    name: () => t`Health`,
    icon: health,
  },
  money_post: {
    // translator: Root category
    name: () => t`Money`,
    icon: money_post,
  },
  sport: {
    // translator: Root category
    name: () => t`Sports`,
    icon: sport,
  },
  // This returns all places that either ARE a toilet, or HAVE an accessible toilet
  toilets: {
    // translator: Meta category for any toilet or any place with an accessible toilet
    name: () => t`Toilets`,
    icon: ToiletIcon,
    applyCustomSearchParams: (params: URLSearchParams) => {
      params.set("hasToiletInfo", "true");
    },
  },
} as const;

export type Category = keyof typeof categories;
export type CategoryProperties = {
  name: () => string;
  icon?: FC;
  priority?: number;
  applyCustomSearchParams?: (params: URLSearchParams) => void;
};

// we're using const assertions in order to automatically generate types
// from the categories. but in order to make sure the categories above are
// also typesafe, we have a validatedCategories variable properly typed.
// if something is off with the categories above, typescript will show an
// error on this validatedSettings variable instead, even though it's not
// in use anywhere. this is not ideal, but it ensures type-safety and allows
// for auto-type magic.
const validatedCategories: Record<Category, CategoryProperties> = categories;
