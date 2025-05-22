import type { FC } from "react";

import * as icons from "./icons";

import { other } from "./categories/other";
import { shopping } from "./categories/shopping";
import { food } from "./categories/food";
import { publicTransfer } from "./categories/public-transfer";
import { culture } from "./categories/culture";
import { leisure } from "./categories/leisure";
import { accommodation } from "./categories/accommodation";
import { tourism } from "./categories/tourism";
import { education } from "./categories/education";
import { government } from "./categories/government";
import { health } from "./categories/health";
import { moneyPost } from "./categories/money-post";
import { sport } from "./categories/sport";
import { toilets } from "./categories/toilets";

const configuredCategories = {
  ...other,
  ...shopping,
  ...food,
  ...publicTransfer,
  ...culture,
  ...leisure,
  ...accommodation,
  ...tourism,
  ...education,
  ...government,
  ...health,
  ...moneyPost,
  ...sport,
  ...toilets,

  unknown: {
    name: () => "Unknown",
    icon: icons.circle,
    hide: true,
  },
} as const;

export type Category = keyof typeof configuredCategories;
export type CategoryBaseProperties = {
  name: () => string;
  icon?: FC;
  synonyms?: Readonly<string[]>;
  priority?: number;
  queryParams?: Record<string, string>;
  parents?: Readonly<Category[]>;
  hide?: boolean;
};
export type CategoryProperties = CategoryBaseProperties & { id: Category };

// we're using const assertions in order to automatically generate types
// from the categories. but in order to make sure the categories above are
// also typesafe, we type this exported variable properly.
// if something is off with the configured categories above, typescript will
// show an error on this categories variable instead. this is not ideal, but
// it ensures type-safety and allows for auto-type magic.
export const categories: Record<Category, CategoryBaseProperties> =
  configuredCategories;

export const topLevelCategories = Object.entries(categories).reduce(
  (acc, [category, properties]) => {
    if (!properties.parents?.length && !properties.hide) {
      acc[category as Category] = properties;
    }
    return acc;
  },
  {} as Partial<Record<Category, CategoryBaseProperties>>,
);
