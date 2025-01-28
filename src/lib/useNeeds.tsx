import { type ReactNode, createContext, useContext, useState } from "react";
import { t } from "ttag";

type NeedSettingsInterface = Record<
  string,
  {
    title: string;
    needs: Record<
      string,
      {
        label: string;
        help?: string;
      }
    >;
  }
>;

// add additional need categories and needs to this settings object,
// everything else including types will be auto-generated based on it.
const needSettings = {
  mobility: {
    title: t`Mobility`,
    needs: {
      "no-need": {
        label: t`I have no mobility needs`,
      },
      "wheelchair-full": {
        label: t`Fully wheelchair accessible`,
        help: t`Entrance has no steps, and all rooms are accessible without steps.`,
      },
      "wheelchair-partial": {
        label: t`Partially wheelchair accessible`,
        help: t`Entrance has one step with max. 3 inches height, most rooms are without steps.`,
      },
      "wheelchair-not": {
        label: t`Not wheelchair accessible`,
        help: t`Entrance has a high step or several steps, none of the rooms are accessible.`,
      },
      "no-data": {
        label: t`No wheelchair info yet`,
        help: t`There is no information available about wheelchair accessibility.`,
      },
    },
  },
  toilet: {
    title: t`Toilets`,
    needs: {
      "no-need": {
        label: t`I have no toilet needs`,
      },
      "wheelchair-full": {
        label: t`Fully wheelchair accessible toilet`,
      },
      "has-toilet": {
        label: t`Has a toilet`,
      },
      "no-data": {
        label: t`No toilet info yet`,
      },
    },
  },
} as const;

// we're using const assertions in order to automatically generate types
// from the needSettings. but in order to make sure the needSettings above
// also satisfy their interface, we export a settings variable typed with
// the aforementioned interface. if something is off with the needSettings
// above, typescript will show an error on this settings variable instead.
// not ideal, but it ensures type-safety and allows for auto-type magic.
export const settings: NeedSettingsInterface = needSettings;

export type NeedSettings = typeof settings;
export type NeedCategory = keyof NeedSettings;
export type Needs = {
  [key in NeedCategory]: keyof (typeof settings)[key]["needs"] | undefined;
};

export const categories = Object.entries(settings).map(
  ([category]) => category as NeedCategory,
);
export const emptyNeeds = Object.fromEntries(
  categories.map((category) => [category, undefined]),
) as Needs;

type NeedsContext = {
  needs: Needs;
  setNeeds: (needs: Needs) => void;
  settings: NeedSettings;
  categories: NeedCategory[];
};
const NeedsContext = createContext<NeedsContext>({
  needs: emptyNeeds,
  setNeeds() {},
  settings,
  categories,
});
export function NeedsContextProvider({ children }: { children: ReactNode }) {
  const [needs, setNeeds] = useState(emptyNeeds);
  return (
    <NeedsContext.Provider value={{ needs, setNeeds, settings, categories }}>
      {children}
    </NeedsContext.Provider>
  );
}
export function useNeeds(): NeedsContext {
  return useContext(NeedsContext);
}
