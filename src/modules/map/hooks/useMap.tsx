import { type ReactNode, createContext, useContext, useState } from "react";
import type { MapRef } from "react-map-gl/mapbox";

type MapContext = {
  map: MapRef | undefined;
  isReady: boolean;
  setIsReady: (ready: boolean) => void;
  setMapRef: (map: MapRef) => void;
};

export const MapContext = createContext<MapContext>({
  map: undefined,
  isReady: false,
  setIsReady: () => {},
  setMapRef: () => {},
});

export function MapContextProvider({ children }: { children: ReactNode }) {
  const [map, setMapRef] = useState<MapRef>();
  const [isReady, setIsReady] = useState(false);

  return (
    <MapContext.Provider
      value={{
        map,
        setMapRef,
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
