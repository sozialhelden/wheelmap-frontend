import type { ReactNode } from "react";
import { categories, type Category } from "~/modules/categories/categories";

import ElevatorIcon from "~/modules/map/icons/elevators/elevator.svg";
import GoodEntranceIcon from "~/modules/map/icons/entrances/house-entrance-good.svg";
import MediocreEntranceIcon from "~/modules/map/icons/entrances/house-entrance-mediocre.svg";
import BadEntranceIcon from "~/modules/map/icons/entrances/house-entrance-bad.svg";
import UnknownEntranceIcon from "~/modules/map/icons/entrances/house-entrance-unknown.svg";

export type AccessibilityGrade = "good" | "mediocre" | "bad" | "unknown";

export type MapIcon =
  | {
      type: "default";
      component: ReactNode;
    }
  | {
      type: "category";
      category: Category;
      accessibilityGrade: AccessibilityGrade;
    };

export const index: Record<string, MapIcon> = {
  elevator: {
    type: "default",
    component: <ElevatorIcon />,
  },
  "house-entrance-good": {
    type: "default",
    component: <GoodEntranceIcon />,
  },
  "house-entrance-mediocre": {
    type: "default",
    component: <MediocreEntranceIcon />,
  },
  "house-entrance-bad": {
    type: "default",
    component: <BadEntranceIcon />,
  },
  "house-entrance-unknown": {
    type: "default",
    component: <UnknownEntranceIcon />,
  },

  ...(["good", "mediocre", "bad", "unknown"] as AccessibilityGrade[]).reduce(
    (acc, accessibilityGrade) => {
      for (const category of Object.keys(categories) as Category[]) {
        acc[`${category}-${accessibilityGrade}`] = {
          type: "category",
          category,
          accessibilityGrade,
        };
      }
      return acc;
    },
    {} as Record<string, MapIcon>,
  ),
};
