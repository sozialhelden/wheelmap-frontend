import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

export type MapHighlightContext = {
  highlightedFeatureIds: string[];
  highlight: (featureId: string | string[]) => void;
  removeHighlight: (featureId: string | string[]) => void;
};

export const MapHighlightContext = createContext<MapHighlightContext>({
  highlightedFeatureIds: [],
  highlight: () => {},
  removeHighlight: () => {},
});

export function MapHighlightContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [highlightedFeatureIds, setHighlightedFeatureIds] = useState<string[]>(
    [],
  );

  const highlight = useCallback(
    (featureId: string | string[]) => {
      const newFeatureIds = [featureId].flat();
      setHighlightedFeatureIds((prev) =>
        Array.from(new Set([...prev, ...newFeatureIds])).filter(Boolean),
      );
    },
    [setHighlightedFeatureIds],
  );

  const removeHighlight = useCallback(
    (featureId: string | string[]) => {
      const featureIdsToRemove = [featureId].flat();
      setHighlightedFeatureIds((prev) =>
        prev.filter((id) => !featureIdsToRemove.includes(id)),
      );
    },
    [setHighlightedFeatureIds],
  );

  return (
    <MapHighlightContext.Provider
      value={{ highlightedFeatureIds, highlight, removeHighlight }}
    >
      {children}
    </MapHighlightContext.Provider>
  );
}

export function useHighlight() {
  return useContext(MapHighlightContext);
}
