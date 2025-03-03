import { t } from "@transifex/native";
import type { FC } from "react";
import { default as Toilet } from "~/components/icons/categories/toilets";
import {
  Accommodation,
  Education,
  Food,
  Government,
  Health,
  Leisure,
  MoneyPost,
  PublicTransfer,
  Shopping,
  Sport,
  Tourism,
} from "~/components/icons/mainCategories";

export const categories = {
  shopping: {
    // translator: Root category
    name: () => t("Shopping"),
    priority: 10,
    iconComponent: Shopping,
  },
  food: {
    // translator: Root category
    name: () => t("Food & Drinks"),
    priority: 20,
    iconComponent: Food,
  },
  public_transfer: {
    // translator: Root category
    name: () => t("Transport"),
    priority: 30,
    iconComponent: PublicTransfer,
  },
  leisure: {
    // translator: Root category
    name: () => t("Leisure"),
    priority: 40,
    iconComponent: Leisure,
  },
  accommodation: {
    // translator: Root category
    name: () => t("Hotels"),
    priority: 40,
    iconComponent: Accommodation,
  },
  tourism: {
    // translator: Root category
    name: () => t("Tourism"),
    iconComponent: Tourism,
  },
  education: {
    // translator: Root category
    name: () => t("Education"),
    iconComponent: Education,
  },
  government: {
    // translator: Root category
    name: () => t("Authorities"),
    iconComponent: Government,
  },
  health: {
    // translator: Root category
    name: () => t("Health"),
    iconComponent: Health,
  },
  money_post: {
    // translator: Root category
    name: () => t("Money"),
    iconComponent: MoneyPost,
  },
  sport: {
    // translator: Root category
    name: () => t("Sports"),
    iconComponent: Sport,
  },
  // This returns all places that either ARE a toilet, or HAVE an accessible toilet
  toilets: {
    // translator: Meta category for any toilet or any place with an accessible toilet
    name: () => t("Toilets"),
    iconComponent: Toilet,
    queryParams: {
      hasToiletInfo: "true",
    },
  },
} as const;

export type Category = keyof typeof categories;
export type CategoryProperties = {
  name: () => string;
  iconComponent?: FC;
  priority?: number;
  queryParams?: Record<string, string>;
};

// we're using const assertions in order to automatically generate types
// from the categories. but in order to make sure the categories above are
// also typesafe, we have a validatedCategories variable properly typed.
// if something is off with the categories above, typescript will show an
// error on this validatedSettings variable instead, even though it's not
// in use anywhere. this is not ideal, but it ensures type-safety and allows
// for auto-type magic.
const validatedCategories: Record<Category, CategoryProperties> = categories;
