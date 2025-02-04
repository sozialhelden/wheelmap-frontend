import type { FC } from "react";
import { t } from "ttag";
import { ToiletIcon } from "~/components/icons/categories/toilet";
import { AccommodationIcon } from "~/components/icons/mainCategories/AccommodationIcon";
import { EducationIcon } from "~/components/icons/mainCategories/EducationIcon";
import { FoodIcon } from "~/components/icons/mainCategories/FoodIcon";
import { GovernmentIcon } from "~/components/icons/mainCategories/GovernmentIcon";
import { HealthIcon } from "~/components/icons/mainCategories/HealthIcon";
import { LeisureIcon } from "~/components/icons/mainCategories/LeisureIcon";
import { MoneyPostIcon } from "~/components/icons/mainCategories/MoneyPostIcon";
import { PublicTransferIcon } from "~/components/icons/mainCategories/PublicTransferIcon";
import { ShoppingIcon } from "~/components/icons/mainCategories/ShoppingIcon";
import { SportIcon } from "~/components/icons/mainCategories/SportIcon";
import { TourismIcon } from "~/components/icons/mainCategories/TourismIcon";

export const categories = {
  shopping: {
    // translator: Root category
    name: () => t`Shopping`,
    priority: 10,
    icon: ShoppingIcon,
  },
  food: {
    // translator: Root category
    name: () => t`Food & Drinks`,
    priority: 20,
    icon: FoodIcon,
  },
  public_transfer: {
    // translator: Root category
    name: () => t`Transport`,
    priority: 30,
    icon: PublicTransferIcon,
  },
  leisure: {
    // translator: Root category
    name: () => t`Leisure`,
    priority: 40,
    icon: LeisureIcon,
  },
  accommodation: {
    // translator: Root category
    name: () => t`Hotels`,
    priority: 40,
    icon: AccommodationIcon,
  },
  tourism: {
    // translator: Root category
    name: () => t`Tourism`,
    icon: TourismIcon,
  },
  education: {
    // translator: Root category
    name: () => t`Education`,
    icon: EducationIcon,
  },
  government: {
    // translator: Root category
    name: () => t`Authorities`,
    icon: GovernmentIcon,
  },
  health: {
    // translator: Root category
    name: () => t`Health`,
    icon: HealthIcon,
  },
  money_post: {
    // translator: Root category
    name: () => t`Money`,
    icon: MoneyPostIcon,
  },
  sport: {
    // translator: Root category
    name: () => t`Sports`,
    icon: SportIcon,
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
