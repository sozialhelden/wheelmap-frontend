import { type ReactNode, createContext, useContext, useMemo } from "react";
import { useAppState } from "~/modules/app-state/hooks/useAppState";
import {
  type NeedCategory,
  type NeedSelection,
  type NeedSettings,
  type NeedValue,
  type Needs,
  categories,
  emptyNeeds,
  settings,
} from "~/modules/needs/needs";

type NeedsContext = {
  needs: Needs;
  selection: NeedSelection;
  setSelection: (needs: NeedSelection) => Promise<void>;
  settings: NeedSettings;
  categories: NeedCategory[];
};

const NeedsContext = createContext<NeedsContext>({
  needs: {},
  selection: emptyNeeds,
  setSelection() {
    return Promise.resolve();
  },
  settings,
  categories,
});

export function NeedsContextProvider({ children }: { children: ReactNode }) {
  const { appState, setAppState } = useAppState();

  const setSelection = async (needs: NeedSelection) => {
    await setAppState({ needs });
  };

  const selection: NeedSelection = appState.needs || ({} as NeedSelection);

  const needs = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(selection)
          .filter(([_, need]) => Boolean(need))
          .map(([category, need]) => {
            return [
              category,
              settings[category as NeedCategory].needs[need as NeedValue],
            ];
          }),
      ),
    [selection],
  );

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
