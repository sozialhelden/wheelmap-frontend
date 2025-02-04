import { type ReactNode, createContext, useContext, useState } from "react";
import {
  type NeedCategory,
  type NeedSettings,
  type Needs,
  settings,
} from "~/config/needs";

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
