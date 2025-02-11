import {createContext, type ReactNode, useContext, useMemo, useState,} from "react";
import {
    categories,
    emptyNeeds,
    type NeedCategory,
    type Needs,
    type NeedSelection,
    type NeedSettings,
    settings,
} from "~/domains/needs/needs";
import {
    useSyncWithLegacyA11yFilterQueryParams,
    useLegacyA11yFilterQueryParamsDefaultSelection,
} from "~/domains/needs/hooks/useLegacyA11yFilterQueryParams";

type NeedsContext = {
  needs: Needs;
  selection: NeedSelection;
  setSelection: (needs: NeedSelection) => void;
  settings: NeedSettings;
  categories: NeedCategory[];
};
const NeedsContext = createContext<NeedsContext>({
  needs: {},
  selection: emptyNeeds,
  setSelection() {},
  settings,
  categories,
});
export function NeedsContextProvider({ children }: { children: ReactNode }) {
  const { defaultSelection } = useLegacyA11yFilterQueryParamsDefaultSelection();
  const [selection, setSelection] = useState(defaultSelection);

  const needs = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(selection)
          .filter(([_, need]) => Boolean(need))
          .map(([category, need]) => {
            return [category, settings[category].needs[need]];
          }),
      ),
    [selection],
  );

  useSyncWithLegacyA11yFilterQueryParams({ needs });

  return (
    <NeedsContext.Provider
      value={{
        needs,
        selection,
        setSelection,
        settings,
        categories,
      }}
    >
      {children}
    </NeedsContext.Provider>
  );
}

export function useNeeds(): NeedsContext {
  return useContext(NeedsContext);
}
