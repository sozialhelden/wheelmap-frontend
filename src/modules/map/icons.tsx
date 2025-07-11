import { type Category, getCategories } from "@sozialhelden/core";
import type { ReactNode } from "react";

import ElevatorIcon from "~/modules/map/icons/elevators/elevator.svg";
import BadEntranceIconDark from "~/modules/map/icons/entrances/house-entrance-bad-dark.svg";
import BadEntranceIcon from "~/modules/map/icons/entrances/house-entrance-bad.svg";
import GoodEntranceIconDark from "~/modules/map/icons/entrances/house-entrance-good-dark.svg";
import GoodEntranceIcon from "~/modules/map/icons/entrances/house-entrance-good.svg";
import MediocreEntranceIconDark from "~/modules/map/icons/entrances/house-entrance-mediocre-dark.svg";
import MediocreEntranceIcon from "~/modules/map/icons/entrances/house-entrance-mediocre.svg";
import UnknownEntranceIconDark from "~/modules/map/icons/entrances/house-entrance-unknown-dark.svg";
import UnknownEntranceIcon from "~/modules/map/icons/entrances/house-entrance-unknown.svg";
import SelectedDark from "~/modules/map/icons/markers/selected-dark.svg";
import Selected from "~/modules/map/icons/markers/selected.svg";

export type AccessibilityGrade = "good" | "mediocre" | "bad" | "unknown";

export type MapIcon =
  | {
      type: "default";
      component: ReactNode;
      componentDarkMode?: ReactNode;
    }
  | {
      type: "category";
      category: Category;
      accessibilityGrade: AccessibilityGrade;
    };

export const icons: Record<string, MapIcon> = {
  selected: {
    type: "default",
    component: <Selected />,
    componentDarkMode: <SelectedDark />,
  },
  elevator: {
    type: "default",
    component: <ElevatorIcon />,
  },
  "house-entrance-good": {
    type: "default",
    component: <GoodEntranceIcon />,
    componentDarkMode: <GoodEntranceIconDark />,
  },
  "house-entrance-mediocre": {
    type: "default",
    component: <MediocreEntranceIcon />,
    componentDarkMode: <MediocreEntranceIconDark />,
  },
  "house-entrance-bad": {
    type: "default",
    component: <BadEntranceIcon />,
    componentDarkMode: <BadEntranceIconDark />,
  },
  "house-entrance-unknown": {
    type: "default",
    component: <UnknownEntranceIcon />,
    componentDarkMode: <UnknownEntranceIconDark />,
  },

  ...(["good", "mediocre", "bad", "unknown"] as AccessibilityGrade[]).reduce(
    (acc, accessibilityGrade) => {
      for (const category of Object.keys(getCategories()) as Category[]) {
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
