import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { MapRef } from "react-map-gl/mapbox";

type MapContext = {
  map: MapRef | undefined;
  setMap: (map: MapRef) => void;
  isReady: boolean;
  setIsReady: (ready: boolean) => void;
};

export const MapContext = createContext<MapContext>({
  map: undefined,
  setMap: () => {},
  isReady: false,
  setIsReady: () => {},
});

export function MapContextProvider({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<MapRef>();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    window.map = map; // for in-browser debugging purposes
  }, [map]);

  return (
    <MapContext.Provider
      value={{
        map,
        setMap,
        isReady,
        setIsReady,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}

export function useMap() {
  return useContext(MapContext);
}
