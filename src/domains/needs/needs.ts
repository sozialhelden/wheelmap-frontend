import { t } from "@transifex/native";
import type { FC } from "react";
import { FullyWheelchairAccessibleIcon } from "~/domains/needs/components/icons/mobility/FullyWheelchairAccessibleIcon";
import { NoDataIcon } from "~/domains/needs/components/icons/mobility/NoDataIcon";
import { NotWheelchairAccessibleIcon } from "~/domains/needs/components/icons/mobility/NotWheelchairAccessibleIcon";
import { PartiallyWheelchairAccessibleCombinationIcon } from "~/domains/needs/components/icons/mobility/PartiallyWheelchairAccessibleCombinationIcon";
import { FullyWheelchairAccessibleToiletIcon } from "~/domains/needs/components/icons/toilets/FullyWheelchairAccessibleToiletIcon";

// add additional need categories and needs to this settings object,
// everything else including types will be auto-generated based on it.
export const settings = {
  mobility: {
    title: () => t("Mobility"),
    legacyQueryParamName: "wheelchair",
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
        legacyQueryParamValues: ["yes"],
      },
      "partially-wheelchair-accessible": {
        label: () => t("Partially wheelchair accessible"),
        help: () =>
          t(
            "Entrance has one step with max. 3 inches height, most rooms are without steps.",
          ),
        icon: PartiallyWheelchairAccessibleCombinationIcon,
        legacyQueryParamValues: ["limited", "yes"],
      },
      "not-wheelchair-accessible": {
        label: () => t("Not wheelchair accessible"),
        help: () =>
          t(
            "Entrance has a high step or several steps, none of the rooms are accessible.",
          ),
        icon: NotWheelchairAccessibleIcon,
        legacyQueryParamValues: ["no"],
      },
      "no-data": {
        label: () => t("No wheelchair info yet"),
        help: () =>
          t(
            "There is no information available about wheelchair accessibility.",
          ),
        icon: NoDataIcon,
        legacyQueryParamValues: ["unknown"],
      },
    },
  },
  toilet: {
    title: () => t("Toilets"),
    legacyQueryParamName: "toilet",
    needs: {
      "no-need": {
        label: () => t("I have no toilet needs"),
      },
      "fully-wheelchair-accessible": {
        label: () => t("Fully wheelchair accessible toilet"),
        icon: FullyWheelchairAccessibleToiletIcon,
        legacyQueryParamValues: ["yes"],
      },
      // Would be nice, but we currently have no way to filter for it
      // "toilet-present": {
      //   label: () => t(`Has a toilet`),
      //   icon: ToiletPresentIcon,
      // },
      // "no-data": {
      //   label: () => t(`No toilet info yet`),
      // },
    },
  },
} as const;

// Complete configuration of all available needs and their respective categories
export type NeedSettings = typeof settings;
// Identifier for a category that groups multiple needs
export type NeedCategory = keyof NeedSettings;
// All the properties each individual need has
export type NeedProperties = {
  label: () => string;
  help?: () => string;
  icon?: FC;
  legacyQueryParamValues?: Readonly<string[]>;
};
// A map that contains what need has been selected for each available category
export type NeedSelection = {
  [key in NeedCategory]: keyof (typeof settings)[key]["needs"] | undefined;
};

// A map that contains all the properties of the selected need for each
// available category
export type Needs = {
  [key in NeedCategory]?: NeedProperties;
};

// we're using const assertions in order to automatically generate types
// from the settings. but in order to make sure the settings above also
// satisfy their own interface, we have a validatedSettings variable typed
// with the aforementioned interface. if something is off with the settings
// above, typescript will show an error on this validatedSettings variable
// instead, even though it's not in use anywhere. this is not ideal, but it
// ensures type-safety and allows for auto-type magic.
const validatedSettings: Record<
  string,
  {
    title: () => string;
    legacyQueryParamName?: string;
    needs: Record<string, NeedProperties>;
  }
> = settings;

export const categories = Object.entries(settings).map(
  ([category]) => category as NeedCategory,
);

export const emptyNeeds = Object.fromEntries(
  categories.map((category) => [category, undefined]),
) as NeedSelection;
