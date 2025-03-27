import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useSelectionFromLegacyA11yQueryParams,
  useSyncWithLegacyA11yQueryParams,
} from "~/modules/needs/hooks/useLegacyA11yFilterQueryParams";
import {
  type NeedCategory,
  type NeedSelection,
  type NeedSettings,
  type Needs,
  categories,
  emptyNeeds,
  settings,
} from "~/modules/needs/needs";

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
const localStorageKey = "a11ymap-needs";

function persistSelection(selection: NeedSelection) {
  localStorage.setItem(localStorageKey, JSON.stringify(selection));
}
function getSelectionFromPersistence(): NeedSelection {
  return (
    JSON.parse(
      (typeof localStorage !== "undefined" ? localStorage : null)?.getItem(
        localStorageKey,
      ) || "null",
    ) || emptyNeeds
  );
}

export function NeedsContextProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState(
    useSelectionFromLegacyA11yQueryParams() || getSelectionFromPersistence(),
  );

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

  useSyncWithLegacyA11yQueryParams({ needs });
  useEffect(() => persistSelection(selection), [selection]);

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
