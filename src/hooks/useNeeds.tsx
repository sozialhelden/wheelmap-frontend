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
import {
  useLegacyA11yFilterQueryParams,
  useLegacyA11yFilterQueryParamsDefaultSelection,
} from "~/hooks/useLegacyA11yFilterQueryParams";
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

  useLegacyA11yFilterQueryParams({ needs });

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
