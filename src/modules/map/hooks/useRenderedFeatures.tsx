import type { GeoJSONFeature, MapDataEvent } from "mapbox-gl";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAppState } from "~/modules/app-state/hooks/useAppState";
import { useLayers } from "~/modules/map/hooks/useLayers";
import { useMap } from "~/modules/map/hooks/useMap";

type MapRenderedFeaturesContext = {
  features: GeoJSONFeature[];
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onSourceData: (event?: MapDataEvent) => void;
};

export const MapRenderedFeaturesContext =
  createContext<MapRenderedFeaturesContext>({
    features: [],
    isLoading: false,
    setIsLoading: () => {},
    onSourceData: () => {},
  });

export function MapRenderedFeaturesContextProvider({
  children,
}: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [features, setFeatures] = useState<GeoJSONFeature[]>([]);

  const { map, isReady } = useMap();
  const { appState } = useAppState();
  const { listLayers } = useLayers();

  const debounceTimeout = useRef<NodeJS.Timeout>();

  const updateFeatures = useCallback(() => {
    setIsLoading(true);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      const features =
        isReady &&
        map?.queryRenderedFeatures({
          layers: listLayers?.map((l) => l.id),
        });
      if (features) {
        setFeatures(features);
      }
      setIsLoading(false);
    }, 500);
  }, [debounceTimeout, isReady, map, listLayers, setIsLoading]);

  useEffect(() => {
    updateFeatures();
  }, [isReady, listLayers, appState]);

  return (
    <MapRenderedFeaturesContext.Provider
      value={{
        features,
        isLoading,
        setIsLoading,
        onSourceData: updateFeatures,
      }}
    >
      {children}
    </MapRenderedFeaturesContext.Provider>
  );
}

export function useRenderedFeatures() {
  return useContext(MapRenderedFeaturesContext);
}
