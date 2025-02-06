import React, {
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import type { MapRef } from "react-map-gl";
import { MapOverlaps } from "./MapOverlapPadding";

const mapOverlaps = new MapOverlaps();

export interface GlobalMapContextValue {
  map: MapRef | null;
  mapOverlaps: MapOverlaps;
  setMapRef: (node: MapRef | null) => void;
}

export const GlobalMapContext = React.createContext<GlobalMapContextValue>({
  map: null,
  mapOverlaps,
  setMapRef: () => {
    throw new Error("setMapRef was not provided");
  },
});

export const GlobalMapContextProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  // this will not change frequently, thus we need not to be afraid of re-rendering
  const [mapRef, setMapRef] = useState<MapRef | null>(null);

  const value = useMemo(
    () => ({
      map: mapRef,
      mapOverlaps,
      setMapRef,
    }),
    [mapRef],
  );

  return (
    <GlobalMapContext.Provider value={value}>
      {children}
    </GlobalMapContext.Provider>
  );
};

export const useMapOverlapRef = (isActive = true) => {
  const key = useId();
  const elementRef = useRef<HTMLElement | undefined>();

  const setRef = useCallback(
    (element: HTMLElement) => {
      elementRef.current = element;
      if (element) {
        mapOverlaps.addOverlapRegion(key, element);
      } else {
        mapOverlaps.removeOverlapRegion(key);
      }
    },
    [key],
  );

  useEffect(() => {
    if (isActive && elementRef.current) {
      mapOverlaps.addOverlapRegion(key, elementRef.current);
    } else {
      mapOverlaps.removeOverlapRegion(key);
    }
  }, [isActive, key]);

  useEffect(
    () => () => {
      mapOverlaps.removeOverlapRegion(key);
    },
    [key],
  );

  return isActive ? setRef : undefined;
};
