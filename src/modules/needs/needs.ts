import { t } from "@transifex/native";
import type { FC } from "react";
import { FullyWheelchairAccessibleIcon } from "~/modules/needs/components/icons/mobility/FullyWheelchairAccessibleIcon";
import { NoDataIcon } from "~/modules/needs/components/icons/mobility/NoDataIcon";
import { NotWheelchairAccessibleIcon } from "~/modules/needs/components/icons/mobility/NotWheelchairAccessibleIcon";
import { PartiallyWheelchairAccessibleCombinationIcon } from "~/modules/needs/components/icons/mobility/PartiallyWheelchairAccessibleCombinationIcon";
import { FullyWheelchairAccessibleToiletIcon } from "~/modules/needs/components/icons/toilets/FullyWheelchairAccessibleToiletIcon";
import { ToiletPresentIcon } from "~/modules/needs/components/icons/toilets/ToiletPresentIcon";

// add additional need categories and needs to this settings object,
// everything else including types will be auto-generated based on it.
const configuredSettings = {
  mobility: {
    title: () => t("Mobility"),
    needs: {
      "no-need": {
        label: () => t("I have no mobility needs"),
      },
      "fully-wheelchair-accessible": {
        label: () => t("Fully wheelchair accessible"),
        help: () =>
          t(
            "Entrance has no steps, and all rooms are accessible without steps.",
          ),
        icon: FullyWheelchairAccessibleIcon,
      },
      "partially-wheelchair-accessible": {
        label: () => t("Partially wheelchair accessible"),
        help: () =>
          t(
            "Entrance has one step with max. 3 inches height, most rooms are without steps.",
          ),
        icon: PartiallyWheelchairAccessibleCombinationIcon,
      },
      "not-wheelchair-accessible": {
        label: () => t("Not wheelchair accessible"),
        help: () =>
          t(
            "Entrance has a high step or several steps, none of the rooms are accessible.",
          ),
        icon: NotWheelchairAccessibleIcon,
      },
      "no-data": {
        label: () => t("No wheelchair info yet"),
        help: () =>
          t(
            "There is no information available about wheelchair accessibility.",
          ),
        icon: NoDataIcon,
      },
    },
  },
  toilet: {
    title: () => t("Toilets"),
    needs: {
      "no-need": {
        label: () => t("I have no toilet needs"),
      },
      "fully-wheelchair-accessible": {
        label: () => t("Fully wheelchair accessible toilet"),
        icon: FullyWheelchairAccessibleToiletIcon,
      },
      "toilet-present": {
        label: () => t("Has a toilet"),
        icon: ToiletPresentIcon,
      },
      // Would be nice, but we currently have no way to filter for it
      // "no-data": {
      //   label: () => t(`No toilet info yet`),
      // },
    },
  },
} as const;

// Identifier for a category that groups multiple needs
export type NeedCategory = keyof typeof configuredSettings;

// Possible values for needs
export type NeedValue =
  keyof (typeof configuredSettings)[NeedCategory]["needs"];

// All the properties each individual need has
export type NeedProperties = {
  label: () => string;
  help?: () => string;
  icon?: FC;
};

// Complete configuration of all available needs and their respective categories
export type NeedSettings = Record<
  string,
  {
    title: () => string;
    needs: Record<string, NeedProperties>;
  }
>;

// A map that contains what need has been selected for each available category
export type NeedSelection = {
  [key in NeedCategory]:
    | keyof (typeof configuredSettings)[key]["needs"]
    | undefined;
};

// A map that contains all the properties of the selected need for each
// available category
export type Needs = {
  [key in NeedCategory]?: NeedProperties;
};

// we're using const assertions in order to automatically generate types
// from the settings. but in order to make sure the configuredSettings above
// also satisfy their own interface, we have a settings variable typed
// with the aforementioned interface. if something is off with the
// configuredSettings above, typescript will show an error on this settings
// variable instead. this is not ideal, but it ensures type-safety and allows
// for auto-type magic.
export const settings: NeedSettings = configuredSettings;

export const categories = Object.entries(settings).map(
  ([category]) => category as NeedCategory,
);

export const emptyNeeds = Object.fromEntries(
  categories.map((category) => [category, undefined]),
) as NeedSelection;
