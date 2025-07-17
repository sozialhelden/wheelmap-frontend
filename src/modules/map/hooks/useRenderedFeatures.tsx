import type { GeoJSONFeature, MapDataEvent } from "mapbox-gl";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAppState } from "~/modules/app-state/hooks/useAppState";
import { useLayers } from "~/modules/map/hooks/useLayers";
import { useMap } from "~/modules/map/hooks/useMap";

export type MapRenderedFeaturesContext = {
  features: GeoJSONFeature[];
  isLoading: boolean;
  zoomLevelTooLow: boolean;
  setIsLoading: (loading: boolean) => void;
  onSourceData: (event?: MapDataEvent) => void;
};

export const MapRenderedFeaturesContext =
  createContext<MapRenderedFeaturesContext>({
    features: [],
    isLoading: false,
    zoomLevelTooLow: false,
    setIsLoading: () => {},
    onSourceData: () => {},
  });

export function MapRenderedFeaturesContextProvider({
  children,
}: { children: ReactNode }) {
  const [features, setFeatures] = useState<GeoJSONFeature[]>([]);
  const [featureIdsString, setFeatureIdsString] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const { map, isReady } = useMap();
  const { appState } = useAppState();
  const { listLayers } = useLayers();

  const layers = useMemo(() => listLayers.map((l) => l.id), [listLayers]);
  const zoomLevelTooLow = isReady && (map?.getZoom() ?? 0) <= 14;

  const debounceTimeout = useRef<NodeJS.Timeout>();

  const updateFeatures = useCallback(() => {
    setIsLoading(true);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      if (!isReady || zoomLevelTooLow) {
        setIsLoading(false);
        return;
      }

      const newFeatureIds: string[] = [];
      const newFeatures = map
        ?.queryRenderedFeatures({ layers })
        .filter((feature) => {
          // This ensures features are unique. Because features come from tiled vector data
          // or GeoJSON data that is converted to tiles in mapbox, feature geometries may
          // be split or duplicated across tile boundaries and, as a result, features may
          // appear multiple times in query results.
          if (
            !feature.properties?.id ||
            newFeatureIds.includes(feature.properties.id)
          ) {
            return false;
          }
          newFeatureIds.push(feature.properties.id);
          return true;
        });

      // In order to prevent unnecessary re-renders down the component tree, this ensures
      // the features get only update if the list of features has actually changed. As the
      // features returned by queryRenderedFeatures are different on each call of the function
      // (even if the queried features themselves are the same), we compare create a string
      // representation of the feature ids and compare it to the previous one.
      const newFeatureIdsString = newFeatureIds.sort().join("-");
      if (newFeatureIdsString === featureIdsString) {
        setIsLoading(false);
        return;
      }

      setFeatureIdsString(newFeatureIdsString);
      setFeatures(newFeatures as GeoJSONFeature[]);
      setIsLoading(false);
    }, 250);
  }, [
    debounceTimeout,
    isReady,
    zoomLevelTooLow,
    map,
    layers,
    featureIdsString,
    setFeatures,
    setFeatureIdsString,
    setIsLoading,
  ]);

  useEffect(() => {
    updateFeatures();
  }, [isReady, layers, appState]);

  return (
    <MapRenderedFeaturesContext.Provider
      value={{
        features,
        isLoading,
        setIsLoading,
        onSourceData: updateFeatures,
        zoomLevelTooLow,
      }}
    >
      {children}
    </MapRenderedFeaturesContext.Provider>
  );
}

export function useRenderedFeatures() {
  return useContext(MapRenderedFeaturesContext);
}
