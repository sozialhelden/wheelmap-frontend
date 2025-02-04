import type { FC } from "react";
import { t } from "ttag";
import { FullyWheelchairAccessibleIcon } from "~/icons/needs/mobility/FullyWheelchairAccessibleIcon";
import { NoDataIcon } from "~/icons/needs/mobility/NoDataIcon";
import { NotWheelchairAccessibleIcon } from "~/icons/needs/mobility/NotWheelchairAccessibleIcon";
import { PartiallyWheelchairAccessibleCombinationIcon } from "~/icons/needs/mobility/PartiallyWheelchairAccessibleCombinationIcon";
import { FullyWheelchairAccessibleToiletIcon } from "~/icons/needs/toilets/FullyWheelchairAccessibleToiletIcon";
import { ToiletPresentIcon } from "~/icons/needs/toilets/ToiletPresentIcon";

export type NeedProperties = {
  label: () => string;
  help?: () => string;
  icon?: FC;
};

type ValidatedNeedSettings = Record<
  string,
  {
    title: string;
    needs: Record<string, NeedProperties>;
  }
>;

// add additional need categories and needs to this settings object,
// everything else including types will be auto-generated based on it.
export const settings = {
  mobility: {
    title: t`Mobility`,
    needs: {
      "no-need": {
        label: () => t`I have no mobility needs`,
      },
      "fully-wheelchair-accessible": {
        label: () => t`Fully wheelchair accessible`,
        help: () =>
          t`Entrance has no steps, and all rooms are accessible without steps.`,
        icon: FullyWheelchairAccessibleIcon,
      },
      "partially-wheelchair-accessible": {
        label: () => t`Partially wheelchair accessible`,
        help: () =>
          t`Entrance has one step with max. 3 inches height, most rooms are without steps.`,
        icon: PartiallyWheelchairAccessibleCombinationIcon,
      },
      "not-wheelchair-accessible": {
        label: () => t`Not wheelchair accessible`,
        help: () =>
          t`Entrance has a high step or several steps, none of the rooms are accessible.`,
        icon: NotWheelchairAccessibleIcon,
      },
      "no-data": {
        label: () => t`No wheelchair info yet`,
        help: () =>
          t`There is no information available about wheelchair accessibility.`,
        icon: NoDataIcon,
      },
    },
  },
  toilet: {
    title: t`Toilets`,
    needs: {
      "no-need": {
        label: () => t`I have no toilet needs`,
      },
      "fully-wheelchair-accessible": {
        label: () => t`Fully wheelchair accessible toilet`,
        icon: FullyWheelchairAccessibleToiletIcon,
      },
      "toilet-present": {
        label: () => t`Has a toilet`,
        icon: ToiletPresentIcon,
      },
      "no-data": {
        label: () => t`No toilet info yet`,
      },
    },
  },
} as const;

// we're using const assertions in order to automatically generate types
// from the settings. but in order to make sure the settings above also
// satisfy their own interface, we have a validatedSettings variable typed
// with the aforementioned interface. if something is off with the settings
// above, typescript will show an error on this validatedSettings variable
// instead, even though it's not in use anywhere. this is not ideal, but it
// ensures type-safety and allows for auto-type magic.
const validatedSettings: ValidatedNeedSettings = settings;

export type NeedSettings = typeof settings;
export type NeedCategory = keyof NeedSettings;
export type Needs = {
  [key in NeedCategory]: keyof (typeof settings)[key]["needs"] | undefined;
};
