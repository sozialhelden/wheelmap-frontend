import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  type NeedCategory,
  type NeedSelection,
  type NeedSettings,
  type Needs,
  settings,
} from "~/config/needs";
import { useAppStateAwareRouter } from "~/lib/util/useAppStateAwareRouter";

export const categories = Object.entries(settings).map(
  ([category]) => category as NeedCategory,
);
export const emptyNeeds = Object.fromEntries(
  categories.map((category) => [category, undefined]),
) as NeedSelection;

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
  const router = useAppStateAwareRouter();
  const [selection, setSelection] = useState(emptyNeeds);

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const queryParams = {
      toilet: Object.values(needs).reduce((acc, need) => {
        // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
        return [...acc, ...(need?.legacyQueryParams?.toilet ?? [])];
      }, []),
      wheelchair: Object.values(needs).reduce((acc, need) => {
        // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
        return [...acc, ...(need?.legacyQueryParams?.wheelchair ?? [])];
      }, []),
    };
    const queryHasChanged = Object.entries(queryParams).find(
      ([param, value]) => {
        return router.query[param] !== value;
      },
    );
    if (queryHasChanged) {
      router.push({ query: queryParams });
    }
  }, [needs]);

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
